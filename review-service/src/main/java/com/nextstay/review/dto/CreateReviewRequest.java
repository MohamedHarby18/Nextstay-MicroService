package com.nextstay.review.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateReviewRequest {
    private UUID reservationId;
    private UUID listingId;
    private int rating; // Must be 1-5
    private String comment;
}