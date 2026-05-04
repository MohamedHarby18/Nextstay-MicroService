package com.nextstay.listing.service;

import com.nextstay.common.dto.ListingResponse;
import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.listing.dto.ListingRequest;
import com.nextstay.listing.entity.Listing;
import com.nextstay.listing.entity.ListingStatus;
import com.nextstay.listing.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingResponse createListing(UUID hostId, ListingRequest request) {
        if (request.getPricePerNight().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price per night must be greater than 0");
        }
        if (request.getMaxGuests() <= 0) {
            throw new BadRequestException("Max guests must be greater than 0");
        }

        Listing listing = Listing.builder()
                .hostId(hostId)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .pricePerNight(request.getPricePerNight())
                .maxGuests(request.getMaxGuests())
                .status(ListingStatus.ACTIVE)
                .averageRating(0.0)
                .build();

        listing = listingRepository.save(listing);
        return mapToListingResponse(listing);
    }

    public ListingResponse updateListing(UUID listingId, UUID hostId, ListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        if (!listing.getHostId().equals(hostId)) {
            throw new UnauthorizedException("Only the host who created the listing can update it");
        }

        if (request.getPricePerNight().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price per night must be greater than 0");
        }
        if (request.getMaxGuests() <= 0) {
            throw new BadRequestException("Max guests must be greater than 0");
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setLocation(request.getLocation());
        listing.setPricePerNight(request.getPricePerNight());
        listing.setMaxGuests(request.getMaxGuests());

        listing = listingRepository.save(listing);
        return mapToListingResponse(listing);
    }

    public void deleteListing(UUID listingId, UUID hostId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        if (!listing.getHostId().equals(hostId)) {
            throw new UnauthorizedException("Only the host who created the listing can delete it");
        }

        listing.setStatus(ListingStatus.INACTIVE);
        listingRepository.save(listing);
    }

    public ListingResponse getListingById(UUID listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        return mapToListingResponse(listing);
    }

    public List<ListingResponse> getAllActiveListings() {
        return listingRepository.findByStatus(ListingStatus.ACTIVE).stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    public List<ListingResponse> getListingsByHost(UUID hostId) {
        return listingRepository.findByHostId(hostId).stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    public List<ListingResponse> searchListings(String location, BigDecimal minPrice, BigDecimal maxPrice) {
        if (location != null && !location.isEmpty()) {
            return listingRepository.findByLocationContainingIgnoreCaseAndStatus(location, ListingStatus.ACTIVE).stream()
                    .filter(l -> (minPrice == null || l.getPricePerNight().compareTo(minPrice) >= 0) &&
                                 (maxPrice == null || l.getPricePerNight().compareTo(maxPrice) <= 0))
                    .map(this::mapToListingResponse)
                    .collect(Collectors.toList());
        } else if (minPrice != null && maxPrice != null) {
            return listingRepository.findByPricePerNightBetweenAndStatus(minPrice, maxPrice, ListingStatus.ACTIVE).stream()
                    .map(this::mapToListingResponse)
                    .collect(Collectors.toList());
        }
        
        return getAllActiveListings();
    }

    public void updateAverageRating(UUID listingId, Double newRating) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        listing.setAverageRating(newRating);
        listingRepository.save(listing);
    }

    private ListingResponse mapToListingResponse(Listing listing) {
        return ListingResponse.builder()
                .id(listing.getId())
                .hostId(listing.getHostId())
                .title(listing.getTitle())
                .location(listing.getLocation())
                .pricePerNight(listing.getPricePerNight())
                .maxGuests(listing.getMaxGuests())
                .status(listing.getStatus().name())
                .averageRating(listing.getAverageRating())
                .build();
    }
}
