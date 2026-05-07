package com.nextstay.listing.controller;

import com.nextstay.listing.dto.request.AvailabilityRequestDto;
import com.nextstay.listing.dto.response.*;
import com.nextstay.listing.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings/{listingId}/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // Get all available (unblocked) slots
    @GetMapping //True
    public ResponseEntity<ApiResponse<List<AvailabilityResponseDto>>> getAvailableSlots(@PathVariable UUID listingId) {
        return ResponseEntity.ok(ApiResponse.success("Success", availabilityService.getAvailableSlots(listingId)));
    }

    // Check availability for a date range True
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkAvailability(
            @PathVariable UUID listingId,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        boolean available = availabilityService.checkAvailability(listingId,
                java.time.LocalDate.parse(checkIn), java.time.LocalDate.parse(checkOut));
        return ResponseEntity.ok(ApiResponse.success("Success", available));
    }

    // FR-07: Host manages availability (block/unblock dates) True
    @PostMapping("/manage")
    public ResponseEntity<ApiResponse<Void>> manageAvailability(
            @PathVariable UUID listingId,
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody AvailabilityRequestDto request) {
        availabilityService.manageAvailability(listingId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Availability updated", null));
    }
}