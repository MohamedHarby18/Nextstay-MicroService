package com.nextstay.review.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;


@Data
@Entity
@Table(name = "reviews")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "guest_id", nullable = false)
    private UUID guestId;

    @Column(name = "reservation_id", nullable = false, unique = true)
    private UUID reservationId;

    @Column(name = "listing_id")
    private UUID listingId;

    @Column(nullable = false)
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

}