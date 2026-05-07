package com.nextstay.listing.service;

import com.nextstay.listing.dto.request.AvailabilityRequestDto;
import com.nextstay.listing.dto.response.AvailabilityResponseDto;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AvailabilityService {
    List<AvailabilityResponseDto> getAvailableSlots(UUID listingId);
    boolean checkAvailability(UUID listingId, LocalDate checkIn, LocalDate checkOut);
    void blockDates(UUID listingId, LocalDate start, LocalDate end);
    void unblockDates(UUID listingId, LocalDate start, LocalDate end);
    // For admin/host override (SRS FR‑07) – using the same block/unblock logic
    void manageAvailability(UUID listingId, AvailabilityRequestDto request, UUID userId);
}