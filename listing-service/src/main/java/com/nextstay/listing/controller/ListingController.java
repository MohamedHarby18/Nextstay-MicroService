package com.nextstay.listing.controller;

import com.nextstay.listing.dto.request.*;
import com.nextstay.listing.dto.response.*;
import com.nextstay.listing.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    // FR-05: Create listing (Host only) true
    @PostMapping
    public ResponseEntity<ApiResponse<ListingResponseDto>> createListing(
            @RequestHeader("X-User-Id") UUID hostId,
            @Valid @RequestBody ListingRequestDto request) {
        ListingResponseDto listing = listingService.createListing(hostId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Listing created", listing));
    }

    // Update listing true
    @PutMapping("/{listingId}")
    public ResponseEntity<ApiResponse<ListingResponseDto>> updateListing(
            @PathVariable UUID listingId,
            @RequestHeader("X-User-Id") UUID hostId,
            @Valid @RequestBody ListingUpdateRequestDto request) {
        ListingResponseDto listing = listingService.updateListing(listingId, hostId, request);
        return ResponseEntity.ok(ApiResponse.success("Listing updated", listing));
    }

    // Delete listing
    @DeleteMapping("/{listingId}")
    public ResponseEntity<ApiResponse<Void>> deleteListing(
            @PathVariable UUID listingId,
            @RequestHeader("X-User-Id") UUID hostId) {
        listingService.deleteListing(listingId, hostId);
        return ResponseEntity.ok(ApiResponse.success("Listing deleted", null));
    }

    // Get single listing true
    @GetMapping("/{listingId}")
    public ResponseEntity<ApiResponse<ListingResponseDto>> getListingById(@PathVariable UUID listingId) {
        return ResponseEntity.ok(ApiResponse.success("Success", listingService.getListingById(listingId)));
    }

    // Get all active listings True
    @GetMapping
    public ResponseEntity<ApiResponse<List<ListingResponseDto>>> getAllActiveListings() {
        return ResponseEntity.ok(ApiResponse.success("Success", listingService.getAllActiveListings()));
    }

    // Get listings by host True
    @GetMapping("/host/{hostId}")
    public ResponseEntity<ApiResponse<List<ListingResponseDto>>> getListingsByHost(@PathVariable UUID hostId) {
        return ResponseEntity.ok(ApiResponse.success("Success", listingService.getListingsByHost(hostId)));
    }

    // FR-06: Search listings (guest) True
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ListingResponseDto>>> searchListings(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(ApiResponse.success("Success",
                listingService.searchListings(location, minPrice, maxPrice)));
    }

    // FR-08: Admin verification True
    @PutMapping("/{listingId}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyListing(
            @PathVariable UUID listingId,
            @RequestHeader("X-User-Id") UUID adminId,
            @Valid @RequestBody AdminListingActionDto action) {
        listingService.verifyListing(listingId, action, adminId);
        return ResponseEntity.ok(ApiResponse.success("Listing status updated", null));
    }

    // Called internally by Review Service to update average rating
    @PutMapping("/{listingId}/rating")
    public ResponseEntity<ApiResponse<Void>> updateAverageRating(
            @PathVariable UUID listingId,
            @RequestParam Double newRating) {
        listingService.updateAverageRating(listingId, newRating);
        return ResponseEntity.ok(ApiResponse.success("Rating updated", null));
    }
}