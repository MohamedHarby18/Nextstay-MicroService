package com.nextstay.review.repository;

import com.nextstay.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    // Find all reviews for a specific listing (for public listing page)
    List<Review> findByListingId(UUID listingId);

    // Find all reviews written by a specific guest (for profile page)
    List<Review> findByGuestId(UUID guestId);

    // Check if a reservation already has a review to prevent duplicates by the same guest
    boolean existsByReservationId(UUID reservationId);
}