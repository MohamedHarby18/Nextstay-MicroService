package com.nextstay.support.controller;

import com.nextstay.support.dto.CreateTicketRequest;
import com.nextstay.support.dto.TicketMessageRequest;
import com.nextstay.support.entity.SupportTicket;
import com.nextstay.support.entity.TicketMessage;
import com.nextstay.support.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    // ─── Guest / Host: create & view own tickets ──────────────────────────────

    @PostMapping //true
    public ResponseEntity<SupportTicket> createTicket(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestHeader("X-User-Role") String userRole,
            @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(supportService.createTicket(userId, userRole, request));
    }

    @GetMapping("/my") //true
    public ResponseEntity<List<SupportTicket>> getMyTickets(
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(supportService.getUserTickets(userId));
    }

    // ─── Messages ─────────────────────────────────────────────────────────────

    @PostMapping("/{ticketId}/messages") //true
    public ResponseEntity<TicketMessage> replyToTicket(
            @PathVariable UUID ticketId,
            @RequestHeader("X-User-Id") UUID senderId,
            @RequestHeader("X-User-Role") String senderRole,
            @RequestBody TicketMessageRequest request) {
        return ResponseEntity
                .ok(supportService.replyToTicket(ticketId, senderId, senderRole, request.getMessageText()));
    }

    @GetMapping("/{ticketId}/messages") //not working
    public ResponseEntity<List<TicketMessage>> getTicketMessages(
            @PathVariable UUID ticketId) {
        return ResponseEntity.ok(supportService.getTicketMessages(ticketId));
    }

    // ─── Assignment (Employees' Admin) ────────────────────────────────────────

    @PutMapping("/{ticketId}/assign/{agentId}") // True
    public ResponseEntity<SupportTicket> assignTicket(
            @PathVariable UUID ticketId,
            @PathVariable UUID agentId,
            @RequestHeader("X-User-Role") String role) {
        // AgentRole.ADMIN = "Employees' Admin" who manages support staff & ticket assignment
        String normalizedRole = role == null ? "" : role.trim().toUpperCase().replace(" ", "_");
        boolean canAssign = "ADMIN".equals(normalizedRole)
                || "ADMAIN".equals(normalizedRole)
                || "SUPPORT_LEAD".equals(normalizedRole)
                || "EMPLOYEES_ADMIN".equals(normalizedRole)
                || "ADMIN_EMPLOYEES".equals(normalizedRole);
        if (!canAssign) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(supportService.assignTicket(ticketId, agentId));
    }

    @PutMapping("/{ticketId}/unassign") //True
    public ResponseEntity<Void> unassignTicket(@PathVariable UUID ticketId) {
        supportService.unassignTicket(ticketId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/agent/{agentId}/unassign") //True
    public ResponseEntity<Void> unassignTicketsForAgent(@PathVariable UUID agentId) {
        supportService.unassignTicketsForAgent(agentId);
        return ResponseEntity.ok().build();
    }

    // ─── Status Transitions (Support Agent) ───────────────────────────────────

    @PutMapping("/{ticketId}/status") // true need Validation
    public ResponseEntity<SupportTicket> updateTicketStatus(
            @PathVariable UUID ticketId,
            @RequestHeader("X-User-Role") String role,
            @RequestParam String status) {
        return ResponseEntity.ok(supportService.updateTicketStatus(ticketId, role, status));
    }

    // ─── Agent Dashboard — status filter only ─────────────────────────────────

    @GetMapping("/dashboard") // True
    public ResponseEntity<List<SupportTicket>> getAgentDashboard(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(supportService.getFilteredTickets(status));
    }

    // ─── Action-needed (SA flags → Users' Admin resolves) ────────────────────

    @PutMapping("/{ticketId}/flag-action") //true
    public ResponseEntity<SupportTicket> flagActionNeeded(
            @PathVariable UUID ticketId,
            @RequestHeader("X-User-Role") String role,
            @RequestParam String actionType) { // "refund" or "deactivation"
        return ResponseEntity.ok(supportService.flagActionNeeded(ticketId, role, actionType));
    }

    @GetMapping("/action-needed") //true
    public ResponseEntity<List<SupportTicket>> getActionNeededTickets(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(required = false) String actionType) {
        return ResponseEntity.ok(supportService.getActionNeededTickets(actionType));
    }

    // ─── Agent Performance Stats (Employees' Admin) ───────────────────────────

    @GetMapping("/agent/{agentId}/stats") // True
    public ResponseEntity<Map<String, Long>> getAgentStats(
            @PathVariable UUID agentId) {
        return ResponseEntity.ok(supportService.getAgentStats(agentId));
    }

    @GetMapping("/stats/overall") // True
    public ResponseEntity<Map<String, Long>> getOverallStats() {
        return ResponseEntity.ok(supportService.getOverallStats());
    }

}

    