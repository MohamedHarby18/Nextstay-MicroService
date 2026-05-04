package com.nextstay.listing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "availability_slots", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"listing_id", "slot_date"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID listingId;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private Boolean isBlocked = false;

    @PrePersist
    public void prePersist() {
        if (isBlocked == null) {
            isBlocked = false;
        }
    }
}
