package com.nextstay.listing.controller;

import jakarta.validation.Valid;
import com.nextstay.listing.dto.request.AmenityRequestDto;
import com.nextstay.listing.dto.response.*;
import com.nextstay.listing.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TransferQueue;

@RestController
@RequestMapping("/api/listings/{listingId}/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping //true
    public ResponseEntity<ApiResponse<AmenityResponseDto>> addAmenity(
            @PathVariable UUID listingId,
            @Valid @RequestBody AmenityRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Amenity added", amenityService.addAmenity(listingId, request)));
    }

    @DeleteMapping("/{amenityId}") //true
    public ResponseEntity<ApiResponse<Void>> removeAmenity(@PathVariable UUID amenityId) {
        amenityService.removeAmenity(amenityId);
        return ResponseEntity.ok(ApiResponse.success("Amenity removed", null));
    }

    @GetMapping //true
    public ResponseEntity<ApiResponse<List<AmenityResponseDto>>> getAmenitiesByListing(@PathVariable UUID listingId) {
        return ResponseEntity.ok(ApiResponse.success("Success", amenityService.getAmenitiesByListing(listingId)));
    }
}