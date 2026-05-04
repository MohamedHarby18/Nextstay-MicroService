package com.nextstay.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID guestId;

    @Column(nullable = false)
    private UUID listingId;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private Integer numGuests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ReservationStatus.PENDING;
        }
    }
}
