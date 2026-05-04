package com.nextstay.listing.controller;

import com.nextstay.common.dto.BlockDatesRequest;
import com.nextstay.listing.dto.AvailabilityRequest;
import com.nextstay.listing.dto.AvailabilityResponse;
import com.nextstay.listing.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings/{listingId}/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<AvailabilityResponse> addAvailabilitySlot(@PathVariable UUID listingId, @RequestBody AvailabilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(availabilityService.addAvailabilitySlot(listingId, request));
    }

    @GetMapping
    public ResponseEntity<List<AvailabilityResponse>> getAvailableSlots(@PathVariable UUID listingId) {
        return ResponseEntity.ok(availabilityService.getAvailableSlots(listingId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable UUID listingId,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut) {
        return ResponseEntity.ok(availabilityService.checkAvailability(listingId, checkIn, checkOut));
    }

    @PostMapping("/block")
    public ResponseEntity<Void> blockDates(@PathVariable UUID listingId, @RequestBody BlockDatesRequest request) {
        availabilityService.blockDates(listingId, request.getCheckInDate(), request.getCheckOutDate());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unblock")
    public ResponseEntity<Void> unblockDates(@PathVariable UUID listingId, @RequestBody BlockDatesRequest request) {
        availabilityService.unblockDates(listingId, request.getCheckInDate(), request.getCheckOutDate());
        return ResponseEntity.ok().build();
    }
}
