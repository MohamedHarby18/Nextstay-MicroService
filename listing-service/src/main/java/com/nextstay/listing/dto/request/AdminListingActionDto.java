package com.nextstay.listing.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminListingActionDto {
    /** "APPROVED" or "FLAGGED" */
    @NotNull(message = "Decision is required")
    private String decision;
    private String reason;
}