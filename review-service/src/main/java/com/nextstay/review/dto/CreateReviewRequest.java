package com.nextstay.review.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateReviewRequest {
    @NotNull(message = "reservationId is required")
    private UUID reservationId;

    private UUID listingId;

    @NotNull(message = "rating is required")
    @Min(value = 1, message = "rating must be between 1 and 5")
    @Max(value = 5, message = "rating must be between 1 and 5")
    private Integer rating; // Must be 1-5

    @JsonAlias({"description"})
    private String comment;
}