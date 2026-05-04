package com.nextstay.support.repository;

import com.nextstay.support.entity.TicketMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketMessageRepository extends JpaRepository<TicketMessage, UUID> {
    // To load the conversation thread in order
    List<TicketMessage> findByTicketIdOrderBySentAtAsc(UUID ticketId);
}