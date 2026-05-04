package com.nextstay.listing.controller;

import com.nextstay.common.dto.ListingResponse;
import com.nextstay.listing.dto.ListingRequest;
import com.nextstay.listing.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(@RequestHeader("X-User-Id") UUID hostId, @RequestBody ListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.createListing(hostId, request));
    }

    @PutMapping("/{listingId}")
    public ResponseEntity<ListingResponse> updateListing(@PathVariable UUID listingId, @RequestHeader("X-User-Id") UUID hostId, @RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.updateListing(listingId, hostId, request));
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> deleteListing(@PathVariable UUID listingId, @RequestHeader("X-User-Id") UUID hostId) {
        listingService.deleteListing(listingId, hostId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{listingId}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable UUID listingId) {
        return ResponseEntity.ok(listingService.getListingById(listingId));
    }

    @GetMapping
    public ResponseEntity<List<ListingResponse>> getAllActiveListings() {
        return ResponseEntity.ok(listingService.getAllActiveListings());
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<ListingResponse>> getListingsByHost(@PathVariable UUID hostId) {
        return ResponseEntity.ok(listingService.getListingsByHost(hostId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ListingResponse>> searchListings(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(listingService.searchListings(location, minPrice, maxPrice));
    }

    @PutMapping("/{listingId}/rating")
    public ResponseEntity<Void> updateAverageRating(@PathVariable UUID listingId, @RequestParam Double newRating) {
        listingService.updateAverageRating(listingId, newRating);
        return ResponseEntity.ok().build();
    }
}
