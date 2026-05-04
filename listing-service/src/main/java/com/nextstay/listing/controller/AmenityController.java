package com.nextstay.listing.controller;

import com.nextstay.listing.dto.AmenityRequest;
import com.nextstay.listing.dto.AmenityResponse;
import com.nextstay.listing.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings/{listingId}/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping
    public ResponseEntity<AmenityResponse> addAmenity(@PathVariable UUID listingId, @RequestBody AmenityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(amenityService.addAmenity(listingId, request));
    }

    @DeleteMapping("/{amenityId}")
    public ResponseEntity<Void> removeAmenity(@PathVariable UUID listingId, @PathVariable UUID amenityId) {
        amenityService.removeAmenity(amenityId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<AmenityResponse>> getAmenitiesByListing(@PathVariable UUID listingId) {
        return ResponseEntity.ok(amenityService.getAmenitiesByListing(listingId));
    }
}
