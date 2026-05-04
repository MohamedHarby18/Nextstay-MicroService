package com.nextstay.listing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private UUID id;
    private UUID listingId;
    private LocalDate slotDate;
    private Boolean isBlocked;
}
