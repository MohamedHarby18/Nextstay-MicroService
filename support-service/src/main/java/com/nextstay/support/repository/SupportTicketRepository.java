package com.nextstay.support.repository;

import com.nextstay.support.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {
    // For Users to see their own history
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    // For Agents to see their dashboard
    List<SupportTicket> findByStatus(SupportTicket.TicketStatus status);
    List<SupportTicket> findByAssignedAgentId(UUID agentId);
    List<SupportTicket> findByUserId(UUID userId);
}