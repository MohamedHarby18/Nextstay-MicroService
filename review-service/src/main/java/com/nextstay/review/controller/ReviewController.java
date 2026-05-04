package com.nextstay.review.controller;

import com.nextstay.common.dto.CreateReviewRequest;
import com.nextstay.common.dto.HostResponseRequest;
import com.nextstay.review.dto.HostResponseResponse;
import com.nextstay.review.entity.Review;
import com.nextstay.review.service.HostResponseService;
import com.nextstay.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final HostResponseService hostResponseService;

    @PostMapping
    public ResponseEntity<Review> submitReview(
            @RequestHeader("X-User-Id") UUID guestId,
            @RequestBody CreateReviewRequest request) {
        Review savedReview = reviewService.submitReview(guestId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<Review>> getListingReviews(@PathVariable UUID listingId) {
        return ResponseEntity.ok(reviewService.getListingReviews(listingId));
    }

    // Host Response Endpoints

    @PostMapping("/{reviewId}/response")
    public ResponseEntity<HostResponseResponse> addHostResponse(
            @PathVariable UUID reviewId,
            @RequestHeader("X-User-Id") UUID hostId,
            @RequestBody HostResponseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hostResponseService.addHostResponse(reviewId, hostId, request));
    }

    @GetMapping("/{reviewId}/response")
    public ResponseEntity<HostResponseResponse> getHostResponse(@PathVariable UUID reviewId) {
        return ResponseEntity.ok(hostResponseService.getHostResponse(reviewId));
    }

    @DeleteMapping("/{reviewId}/response")
    public ResponseEntity<Void> deleteHostResponse(
            @PathVariable UUID reviewId,
            @RequestHeader("X-User-Id") UUID hostId) {
        hostResponseService.deleteHostResponse(reviewId, hostId);
        return ResponseEntity.noContent().build();
    }
}