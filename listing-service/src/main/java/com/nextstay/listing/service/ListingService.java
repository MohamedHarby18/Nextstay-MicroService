package com.nextstay.listing.service;

import com.nextstay.listing.dto.request.*;
import com.nextstay.listing.dto.response.ListingResponseDto;
import java.util.List;
import java.util.UUID;

public interface ListingService {
    ListingResponseDto createListing(UUID hostId, ListingRequestDto request);
    ListingResponseDto updateListing(UUID listingId, UUID hostId, ListingUpdateRequestDto request);
    void deleteListing(UUID listingId, UUID hostId);
    ListingResponseDto getListingById(UUID listingId);
    List<ListingResponseDto> getAllActiveListings();
    List<ListingResponseDto> getListingsByHost(UUID hostId);
    List<ListingResponseDto> searchListings(String location, Double minPrice, Double maxPrice);
    List<ListingResponseDto> getAllListings();
    void verifyListing(UUID listingId, AdminListingActionDto action, UUID adminId);
    void updateAverageRating(UUID listingId, Double newRating); // called by Review Service
}
