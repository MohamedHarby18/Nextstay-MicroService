package com.nextstay.listing.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AvailabilityResponseDto {
    private UUID id;
    private UUID listingId;
    private LocalDate slotDate;
    private boolean blocked;
}