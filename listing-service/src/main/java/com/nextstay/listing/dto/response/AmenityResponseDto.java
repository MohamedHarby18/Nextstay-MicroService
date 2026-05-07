package com.nextstay.listing.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AmenityResponseDto {
    private UUID id;
    private UUID listingId;
    private String name;
}