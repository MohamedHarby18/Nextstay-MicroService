package com.nextstay.support.repository;

import com.nextstay.support.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

    // User: view their own ticket history
    List<SupportTicket> findByUserId(UUID userId);

    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Agent dashboard: filter by status only
    List<SupportTicket> findByStatus(SupportTicket.TicketStatus status);

    List<SupportTicket> findAllByOrderByCreatedAtDesc();

    // Agent assignment
    List<SupportTicket> findByAssignedAgentId(UUID agentId);

    List<SupportTicket> findByAssignedAgentIdAndStatus(UUID agentId, SupportTicket.TicketStatus status);

    // Users' Admin: action-needed tickets
    List<SupportTicket> findByActionNeededTrue();

    List<SupportTicket> findByActionNeededTrueAndActionType(SupportTicket.ActionType actionType);
}