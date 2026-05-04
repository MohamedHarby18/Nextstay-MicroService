package com.nextstay.review.service;

import com.nextstay.common.dto.CreateReviewRequest;
import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ConflictException;
import com.nextstay.review.client.BookingServiceClient;
import com.nextstay.review.client.ListingServiceClient;
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

    public Review submitReview(UUID guestId, CreateReviewRequest request) {
        // Prevent multiple reviews for the same reservation
        if (reviewRepository.existsByReservationId(request.getReservationId())) {
            throw new ConflictException("You have already reviewed this reservation.");
        }

        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5.");
        }

        // Verify reservation completed
        Boolean isCompleted = bookingServiceClient.verifyReservationCompleted(request.getReservationId());
        if (!Boolean.TRUE.equals(isCompleted)) {
            throw new BadRequestException("You can only review a completed reservation.");
        }

        Review review = Review.builder()
                .reservationId(request.getReservationId())
                .guestId(guestId)
                .listingId(request.getListingId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        // Recalculate average rating
        recalculateListingRating(request.getListingId());

        return review;
    }

    public List<Review> getListingReviews(UUID listingId) {
        return reviewRepository.findByListingId(listingId);
    }

    private void recalculateListingRating(UUID listingId) {
        List<Review> listingReviews = reviewRepository.findByListingId(listingId);
        if (listingReviews.isEmpty()) return;

        double sum = 0;
        for (Review r : listingReviews) {
            sum += r.getRating();
        }
        double avg = sum / listingReviews.size();

        listingServiceClient.updateAverageRating(listingId, avg);
    }
}