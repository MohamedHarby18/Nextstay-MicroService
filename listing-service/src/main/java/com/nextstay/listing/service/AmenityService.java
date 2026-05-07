package com.nextstay.listing.service;

import com.nextstay.listing.dto.request.AmenityRequestDto;
import com.nextstay.listing.dto.response.AmenityResponseDto;
import java.util.List;
import java.util.UUID;

public interface AmenityService {
    AmenityResponseDto addAmenity(UUID listingId, AmenityRequestDto request);
    void removeAmenity(UUID amenityId);
    List<AmenityResponseDto> getAmenitiesByListing(UUID listingId);
}