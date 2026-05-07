package com.nextstay.listing.service.impl;

import com.nextstay.listing.dto.request.*;
import com.nextstay.listing.dto.response.ListingResponseDto;
import com.nextstay.listing.entity.*;
import com.nextstay.listing.exception.*;
import com.nextstay.listing.repository.*;
import com.nextstay.listing.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepo;
    private final AmenityRepository amenityRepo;

    @Override
    @Transactional
    public ListingResponseDto createListing(UUID hostId, ListingRequestDto request) {
        Listing listing = Listing.builder()
                .hostId(hostId)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .pricePerNight(BigDecimal.valueOf(request.getPricePerNight()))
                .maxGuests(request.getMaxGuests())
                .status(ListingStatus.INACTIVE)   // pending review
                .averageRating(0.0)
                .build();
        listing = listingRepo.save(listing);

        // Save amenities (if any)
        if (request.getAmenities() != null) {
            for (String name : request.getAmenities()) {
                Amenity amenity = Amenity.builder()
                        .listingId(listing.getId())
                        .name(name)
                        .build();
                amenityRepo.save(amenity);
            }
        }
        return toResponseDto(listing, amenityRepo.findByListingId(listing.getId()));
    }

    @Override
    @Transactional
    public ListingResponseDto updateListing(UUID listingId, UUID hostId, ListingUpdateRequestDto request) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        if (!listing.getHostId().equals(hostId))
            throw new ForbiddenException("Only the host can update the listing");

        if (request.getTitle() != null) listing.setTitle(request.getTitle());
        if (request.getDescription() != null) listing.setDescription(request.getDescription());
        if (request.getLocation() != null) listing.setLocation(request.getLocation());
        if (request.getPricePerNight() != null) listing.setPricePerNight(BigDecimal.valueOf(request.getPricePerNight()));
        if (request.getMaxGuests() != null) listing.setMaxGuests(request.getMaxGuests());

        listingRepo.save(listing);

        // Update amenities: delete all existing, re-add new list (simplest approach)
        if (request.getAmenities() != null) {
            List<Amenity> existing = amenityRepo.findByListingId(listingId);
            amenityRepo.deleteAll(existing);
            for (String name : request.getAmenities()) {
                Amenity amenity = Amenity.builder()
                        .listingId(listingId)
                        .name(name)
                        .build();
                amenityRepo.save(amenity);
            }
        }

        return toResponseDto(listing, amenityRepo.findByListingId(listingId));
    }

    @Override
    @Transactional
    public void deleteListing(UUID listingId, UUID hostId) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        if (!listing.getHostId().equals(hostId))
            throw new ForbiddenException("Only the host can delete the listing");
        // delete amenities first
        List<Amenity> amenities = amenityRepo.findByListingId(listingId);
        amenityRepo.deleteAll(amenities);
        listingRepo.delete(listing);
    }

    @Override
    public ListingResponseDto getListingById(UUID listingId) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        return toResponseDto(listing, amenityRepo.findByListingId(listingId));
    }

    @Override
    public List<ListingResponseDto> getAllActiveListings() {
        return listingRepo.findByStatus(ListingStatus.ACTIVE).stream()
                .map(l -> toResponseDto(l, amenityRepo.findByListingId(l.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public List<ListingResponseDto> getListingsByHost(UUID hostId) {
        return listingRepo.findByHostId(hostId).stream()
                .map(l -> toResponseDto(l, amenityRepo.findByListingId(l.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public List<ListingResponseDto> searchListings(String location, Double minPrice, Double maxPrice) {
        List<Listing> results;

        if (location != null && !location.isBlank()) {
            results = listingRepo.findByLocationContainingIgnoreCaseAndStatus(location, ListingStatus.ACTIVE);
        } else {
            results = listingRepo.findByStatus(ListingStatus.ACTIVE);
        }

        if (minPrice != null && maxPrice != null) {
            BigDecimal min = BigDecimal.valueOf(minPrice);
            BigDecimal max = BigDecimal.valueOf(maxPrice);
            results = results.stream()
                    .filter(l -> l.getPricePerNight().compareTo(min) >= 0 && l.getPricePerNight().compareTo(max) <= 0)
                    .collect(Collectors.toList());
        } else if (minPrice != null) {
            BigDecimal min = BigDecimal.valueOf(minPrice);
            results = results.stream()
                    .filter(l -> l.getPricePerNight().compareTo(min) >= 0)
                    .collect(Collectors.toList());
        } else if (maxPrice != null) {
            BigDecimal max = BigDecimal.valueOf(maxPrice);
            results = results.stream()
                    .filter(l -> l.getPricePerNight().compareTo(max) <= 0)
                    .collect(Collectors.toList());
        }

        return results.stream()
                .map(l -> toResponseDto(l, amenityRepo.findByListingId(l.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void verifyListing(UUID listingId, AdminListingActionDto action, UUID adminId) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        if ("APPROVED".equalsIgnoreCase(action.getDecision())) {
            listing.setStatus(ListingStatus.ACTIVE);
        } else if ("FLAGGED".equalsIgnoreCase(action.getDecision())) {
            listing.setStatus(ListingStatus.SUSPENDED);
        } else {
            throw new IllegalArgumentException("Decision must be APPROVED or FLAGGED");
        }
        listingRepo.save(listing);
        // Admin audit is handled by AOP aspect
    }

    @Override
    @Transactional
    public void updateAverageRating(UUID listingId, Double newRating) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        listing.setAverageRating(newRating);
        listingRepo.save(listing);
    }

    // Helper: convert entity to response DTO
    private ListingResponseDto toResponseDto(Listing listing, List<Amenity> amenities) {
        return ListingResponseDto.builder()
                .id(listing.getId())
                .hostId(listing.getHostId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .location(listing.getLocation())
                .amenities(amenities.stream().map(Amenity::getName).collect(Collectors.toList()))
                .pricePerNight(listing.getPricePerNight())
                .maxGuests(listing.getMaxGuests())
                .status(listing.getStatus().name())
                .averageRating(listing.getAverageRating())
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
}