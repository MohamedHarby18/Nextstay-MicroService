package com.nextstay.support.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "support_tickets")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "user_role", nullable = false)
    private String userRole;

    @Column(name = "assigned_agent_id")
    private UUID assignedAgentId;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum TicketCategory {
        billing, booking, listing, other
    }

    public enum TicketStatus {
        open, in_progress, resolved, closed
    }
}
