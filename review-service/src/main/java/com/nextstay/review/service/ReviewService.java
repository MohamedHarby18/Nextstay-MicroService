package com.nextstay.review.service;

import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ConflictException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.review.client.BookingServiceClient;
import com.nextstay.review.client.ListingServiceClient;
import com.nextstay.review.dto.CreateReviewRequest;
import com.nextstay.review.entity.Review;
import com.nextstay.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingServiceClient bookingServiceClient;
    private final ListingServiceClient listingServiceClient;

    // ─── Submit review (Guest only) ───────────────────────────────────────────

    public Review submitReview(UUID guestId, CreateReviewRequest request) {
        // Prevent duplicate review for same reservation
        if (reviewRepository.existsByReservationId(request.getReservationId())) {
            throw new ConflictException("You have already reviewed this reservation.");
        }

        // Validate rating range
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5.");
        }

        // Verify reservation is completed
        Boolean isCompleted = bookingServiceClient.verifyReservationCompleted(request.getReservationId());
        if (!Boolean.TRUE.equals(isCompleted)) {
            throw new BadRequestException("You can only review a completed reservation.");
        }

        // Verify this reservation actually belongs to the requesting guest
        Boolean isOwner = bookingServiceClient.verifyReservationOwnership(request.getReservationId(), guestId);
        if (!Boolean.TRUE.equals(isOwner)) {
            throw new UnauthorizedException("You can only review your own reservations.");
        }

        Review review = Review.builder()
                .reservationId(request.getReservationId())
                .guestId(guestId)
                .listingId(request.getListingId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        recalculateListingRating(request.getListingId());

        return review;
    }

    // ─── Get reviews for a listing (public) ───────────────────────────────────

    public List<Review> getListingReviews(UUID listingId) {
        return reviewRepository.findByListingId(listingId);
    }

    // ─── Get all reviews by a guest (profile history) ─────────────────────────

    public List<Review> getGuestReviews(UUID guestId) {
        return reviewRepository.findByGuestId(guestId);
    }

    // ─── Delete review (Guest: own only) ─────────────────────────────────────

    public void deleteReview(UUID reviewId, UUID guestId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getGuestId().equals(guestId)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        UUID listingId = review.getListingId();
        reviewRepository.delete(review);
        recalculateListingRating(listingId); // recalculate after deletion; handles empty list
    }

    // ─── Flag review as inappropriate (Support Agent) ─────────────────────────

    public Review flagReview(UUID reviewId, String role) {
        boolean isAgent = role.equalsIgnoreCase("support_agent")
                       || role.equalsIgnoreCase("support_lead");
        if (!isAgent) {
            throw new UnauthorizedException("Only support agents can flag reviews");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setIsFlagged(true);
        return reviewRepository.save(review);
    }

    // ─── Rating recalculation ─────────────────────────────────────────────────

    private void recalculateListingRating(UUID listingId) {
        List<Review> listingReviews = reviewRepository.findByListingId(listingId);
        double avg = listingReviews.isEmpty() ? 0.0
                : listingReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        listingServiceClient.updateAverageRating(listingId, avg);
    }
}