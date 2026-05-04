package com.nextstay.listing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "listings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID hostId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    private Integer maxGuests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status = ListingStatus.ACTIVE;

    @Column(nullable = false)
    private Double averageRating = 0.0;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ListingStatus.ACTIVE;
        }
        if (averageRating == null) {
            averageRating = 0.0;
        }
    }
}
