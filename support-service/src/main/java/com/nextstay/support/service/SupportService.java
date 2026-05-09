package com.nextstay.support.service;

import com.nextstay.support.dto.CreateTicketRequest;
import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.support.client.IdentityServiceClient;
import com.nextstay.support.entity.SupportTicket;
import com.nextstay.support.entity.TicketMessage;
import com.nextstay.support.repository.SupportTicketRepository;
import com.nextstay.support.repository.TicketMessageRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SupportService {

    @Autowired
    private SupportTicketRepository ticketRepository;
    @Autowired
    private TicketMessageRepository messageRepository;
    @Autowired
    private IdentityServiceClient identityServiceClient;

    // ─── Ticket CRUD ──────────────────────────────────────────────────────────

    public SupportTicket createTicket(UUID userId, String userRole, CreateTicketRequest request) {
        String ticketNumber = "NT-" + LocalDate.now().getYear() + "-"
                + String.format("%06d", ticketRepository.count() + 1);

        SupportTicket ticket = SupportTicket.builder()
                .userId(userId)
                .userRole(userRole)
                .ticketNumber(ticketNumber)
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(SupportTicket.TicketStatus.open)
                .build();

        return ticketRepository.save(ticket);
    }

    public List<SupportTicket> getUserTickets(UUID userId) {
        return ticketRepository.findByUserId(userId);
    }

    // ─── Messages ─────────────────────────────────────────────────────────────

    public TicketMessage replyToTicket(UUID ticketId, UUID senderId, String senderRole, String messageText) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        TicketMessage.SenderRole role = TicketMessage.SenderRole.valueOf(senderRole.toLowerCase());

        TicketMessage message = TicketMessage.builder()
                .ticket(ticket)
                .senderId(senderId)
                .senderRole(role)
                .messageText(messageText)
                .build();

        // FR-17: first agent reply → in_progress
        boolean isSupport = role == TicketMessage.SenderRole.support_agent || role == TicketMessage.SenderRole.support_lead;
        if (isSupport && ticket.getStatus() == SupportTicket.TicketStatus.open) {
            ticket.setStatus(SupportTicket.TicketStatus.in_progress);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }

        return messageRepository.save(message);
    }

    public List<TicketMessage> getTicketMessages(UUID ticketId) {
        if (!ticketRepository.existsById(ticketId))
            throw new ResourceNotFoundException("Ticket not found");
        return messageRepository.findByTicketIdOrderBySentAtAsc(ticketId);
    }

    // ─── Assignment (Employees' Admin) ────────────────────────────────────────

    public SupportTicket assignTicket(UUID ticketId, UUID agentId) {
        Boolean agentExists;
        try {
            agentExists = identityServiceClient.agentExists(agentId);
        } catch (FeignException ex) {
            throw new BadRequestException("Unable to validate agent. Check agent ID or identity service availability.");
        }
        if (!Boolean.TRUE.equals(agentExists)) {
            throw new BadRequestException("Agent does not exist");
        }

        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setAssignedAgentId(agentId);
        ticket.setStatus(SupportTicket.TicketStatus.in_progress);
        return ticketRepository.save(ticket);
    }

    public void unassignTicket(UUID ticketId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        ticket.setAssignedAgentId(null);
        ticket.setStatus(SupportTicket.TicketStatus.open);
        ticketRepository.save(ticket);
    }

    public void unassignTicketsForAgent(UUID agentId) {
        List<SupportTicket> tickets = ticketRepository.findByAssignedAgentId(agentId);
        for (SupportTicket ticket : tickets) {
            ticket.setAssignedAgentId(null);
            ticket.setStatus(SupportTicket.TicketStatus.open);
        }
        ticketRepository.saveAll(tickets);
    }

    // ─── Status Transitions (FR-18) ───────────────────────────────────────────

    public SupportTicket updateTicketStatus(UUID ticketId, String role, String newStatus) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        SupportTicket.TicketStatus next = SupportTicket.TicketStatus.valueOf(newStatus.toLowerCase());
        validateTransition(ticket.getStatus(), next, role);

        ticket.setStatus(next);
        ticket.setUpdatedAt(LocalDateTime.now());
        if (next == SupportTicket.TicketStatus.resolved)
            ticket.setResolvedAt(LocalDateTime.now());
        if (next == SupportTicket.TicketStatus.closed)
            ticket.setClosedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    private void validateTransition(SupportTicket.TicketStatus current,
            SupportTicket.TicketStatus next, String role) {
        boolean isAgent = role.equalsIgnoreCase("support_agent")
                || role.equalsIgnoreCase("support_lead");
        if (next == SupportTicket.TicketStatus.in_progress && !isAgent)
            throw new UnauthorizedException("Only agents can move tickets to In Progress");
        if (next == SupportTicket.TicketStatus.resolved && !isAgent)
            throw new UnauthorizedException("Only agents can resolve tickets");
    }

    // ─── Agent Dashboard — status-based filter (FR-20) ────────────────────────

    public List<SupportTicket> getFilteredTickets(String status) {
        if (status == null || status.isBlank()) {
            return ticketRepository.findAllByOrderByCreatedAtDesc();
        }
        SupportTicket.TicketStatus parsedStatus = SupportTicket.TicketStatus.valueOf(status.toLowerCase());
        return ticketRepository.findByStatus(parsedStatus);
    }

    // ─── Action-needed flagging (SA → Users' Admin) ───────────────────────────

    public SupportTicket flagActionNeeded(UUID ticketId, String role, String actionType) {
        boolean isAgent = role.equalsIgnoreCase("support_agent")
                || role.equalsIgnoreCase("support_lead");
        if (!isAgent) {
            throw new UnauthorizedException("Only support staff can flag action-needed tickets");
        }

        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        SupportTicket.ActionType parsedAction;
        try {
            parsedAction = SupportTicket.ActionType.valueOf(actionType.toLowerCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid action type. Allowed: refund, deactivation");
        }

        ticket.setActionNeeded(true);
        ticket.setActionType(parsedAction);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public List<SupportTicket> getActionNeededTickets(String actionType) {
        if (actionType == null || actionType.isBlank()) {
            return ticketRepository.findByActionNeededTrue();
        }

        SupportTicket.ActionType parsedAction;
        try {
            parsedAction = SupportTicket.ActionType.valueOf(actionType.toLowerCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid action type. Allowed: refund, deactivation");
        }

        return ticketRepository.findByActionNeededTrueAndActionType(parsedAction);
    }

    // ─── Agent Performance Stats (Employees' Admin) ───────────────────────────

    public Map<String, Long> getAgentStats(UUID agentId) {
        List<SupportTicket> tickets = ticketRepository.findByAssignedAgentId(agentId);
        long resolved = tickets.stream()
                .filter(t -> t.getStatus() == SupportTicket.TicketStatus.resolved
                        || t.getStatus() == SupportTicket.TicketStatus.closed)
                .count();
        long pending = tickets.size() - resolved;
        return Map.of(
                "total", (long) tickets.size(),
                "resolved", resolved,
                "pending", pending);
    }

    // ─── Overall Platform Stats (Employees' Admin dashboard) ──────────────────

    public Map<String, Long> getOverallStats() {
        List<SupportTicket> all = ticketRepository.findAll();
        long resolved = all.stream()
                .filter(t -> t.getStatus() == SupportTicket.TicketStatus.resolved
                        || t.getStatus() == SupportTicket.TicketStatus.closed)
                .count();
        return Map.of(
                "total", (long) all.size(),
                "resolved", resolved,
                "pending", all.size() - resolved);
    }
}