package com.nextstay.support.controller;

import com.nextstay.common.dto.CreateTicketRequest;
import com.nextstay.common.dto.TicketMessageRequest;
import com.nextstay.support.entity.SupportTicket;
import com.nextstay.support.entity.TicketMessage;
import com.nextstay.support.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<SupportTicket> createTicket(@RequestHeader("X-User-Id") UUID userId, @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(supportService.createTicket(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<SupportTicket>> getMyTickets(@RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(supportService.getUserTickets(userId));
    }

    @PostMapping("/{ticketId}/messages")
    public ResponseEntity<TicketMessage> replyToTicket(
            @PathVariable UUID ticketId, 
            @RequestHeader("X-User-Id") UUID senderId,
            @RequestBody TicketMessageRequest request) {
        return ResponseEntity.ok(supportService.replyToTicket(ticketId, senderId, request.getMessageText()));
    }

    @PutMapping("/{ticketId}/assign/{agentId}")
    public ResponseEntity<SupportTicket> assignTicket(@PathVariable UUID ticketId, @PathVariable UUID agentId) {
        return ResponseEntity.ok(supportService.assignTicket(ticketId, agentId));
    }

    @PutMapping("/{ticketId}/unassign")
    public ResponseEntity<Void> unassignTicket(@PathVariable UUID ticketId) {
        supportService.unassignTicket(ticketId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/agent/{agentId}/unassign")
    public ResponseEntity<Void> unassignTicketsForAgent(@PathVariable UUID agentId) {
        supportService.unassignTicketsForAgent(agentId);
        return ResponseEntity.ok().build();
    }
}