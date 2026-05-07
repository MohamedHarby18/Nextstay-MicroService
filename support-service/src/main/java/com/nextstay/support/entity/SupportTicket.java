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

    private String ticketNumber; // human-readable form (NT-2026-000123, etc.)

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "user_role", nullable = false)
    private String userRole;

    @Column(name = "assigned_agent_id") // nullable — unassigned until an admin assigns it
    private UUID assignedAgentId;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt; // null until resolved

    @Column(name = "closed_at")
    private LocalDateTime closedAt; // null until closed

    @Column(name = "action_needed")
    @Builder.Default
    private Boolean actionNeeded = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type") // refund | deactivation | null
    private ActionType actionType;

    public enum TicketStatus {
        open, in_progress, resolved, closed
    }

    public enum ActionType {
        refund, deactivation
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null)
            status = TicketStatus.open;
        if (actionNeeded == null)
            actionNeeded = false;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
