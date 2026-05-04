package com.nextstay.review.service;

import com.nextstay.common.dto.HostResponseRequest;
import com.nextstay.common.dto.ListingResponse;
import com.nextstay.common.exception.ConflictException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.review.client.ListingServiceClient;
import com.nextstay.review.dto.HostResponseResponse;
import com.nextstay.review.entity.HostResponse;
import com.nextstay.review.entity.Review;
import com.nextstay.review.repository.HostResponseRepository;
import com.nextstay.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HostResponseService {

    private final HostResponseRepository hostResponseRepository;
    private final ReviewRepository reviewRepository;
    private final ListingServiceClient listingServiceClient;

    public HostResponseResponse addHostResponse(UUID reviewId, UUID hostId, HostResponseRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (hostResponseRepository.existsByReviewId(reviewId)) {
            throw new ConflictException("Host response already exists for this review");
        }

        ListingResponse listing = listingServiceClient.getListingById(review.getListingId());
        if (!listing.getHostId().equals(hostId)) {
            throw new UnauthorizedException("Only the host of the listing can respond to reviews");
        }

        HostResponse response = HostResponse.builder()
                .reviewId(reviewId)
                .hostId(hostId)
                .responseText(request.getResponseText())
                .build();

        response = hostResponseRepository.save(response);
        return mapToResponse(response);
    }

    public HostResponseResponse getHostResponse(UUID reviewId) {
        HostResponse response = hostResponseRepository.findByReviewId(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Host response not found"));
        return mapToResponse(response);
    }

    public void deleteHostResponse(UUID reviewId, UUID hostId) {
        HostResponse response = hostResponseRepository.findByReviewId(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Host response not found"));

        if (!response.getHostId().equals(hostId)) {
            throw new UnauthorizedException("Only the authoring host can delete this response");
        }

        hostResponseRepository.delete(response);
    }

    private HostResponseResponse mapToResponse(HostResponse response) {
        return HostResponseResponse.builder()
                .id(response.getId())
                .reviewId(response.getReviewId())
                .hostId(response.getHostId())
                .responseText(response.getResponseText())
                .createdAt(response.getCreatedAt())
                .build();
    }
}
