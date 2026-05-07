package com.nextstay.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class ReviewRequest {
    // The user only needs to provide the reservation ID they are reviewing
    private UUID reservationId; 

    @Min(1) @Max(5)
    private Integer rating;

    @NotBlank(message = "Comment cannot be empty")
    private String comment;
}