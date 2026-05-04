package com.nextstay.support.service;

import com.nextstay.common.dto.CreateTicketRequest;
import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.support.client.IdentityServiceClient;
import com.nextstay.support.entity.SupportTicket;
import com.nextstay.support.entity.TicketMessage;
import com.nextstay.support.repository.SupportTicketRepository;
import com.nextstay.support.repository.TicketMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SupportService {

    @Autowired
    private SupportTicketRepository ticketRepository;
    @Autowired
    private TicketMessageRepository messageRepository;
    @Autowired
    private IdentityServiceClient identityServiceClient;

    public SupportTicket createTicket(UUID userId, CreateTicketRequest request) {
        SupportTicket ticket = SupportTicket.builder()
                .userId(userId)
                .userRole("GUEST") // Assuming GUEST or fetched from token
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(SupportTicket.TicketCategory.valueOf(request.getCategory().toLowerCase()))
                .status(SupportTicket.TicketStatus.open)
                .build();
        return ticketRepository.save(ticket);
    }

    public TicketMessage replyToTicket(UUID ticketId, UUID senderId, String messageText) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        TicketMessage message = TicketMessage.builder()
                .ticket(ticket)
                .senderId(senderId)
                .senderRole(TicketMessage.SenderRole.guest) // default role
                .messageText(messageText)
                .build();

        return messageRepository.save(message);
    }

    public List<SupportTicket> getUserTickets(UUID userId) {
        return ticketRepository.findByUserId(userId); 
    }

    public SupportTicket assignTicket(UUID ticketId, UUID agentId) {
        Boolean agentExists = identityServiceClient.agentExists(agentId);
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
}