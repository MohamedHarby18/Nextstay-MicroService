package com.nextstay.support.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "ticket_messages")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;

    @Column(name = "sender_id", nullable = false)
    private UUID senderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_role", nullable = false)
    private SenderRole senderRole;

    @Column(name = "message_text", columnDefinition = "TEXT", nullable = false)
    private String messageText;

    @Column(name = "sent_at", nullable = false)
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();

    public enum SenderRole {
        guest, host, support_agent
    }
}
