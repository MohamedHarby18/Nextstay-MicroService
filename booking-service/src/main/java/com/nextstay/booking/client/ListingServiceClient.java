package com.nextstay.booking.client;

import com.nextstay.common.dto.BlockDatesRequest;
import com.nextstay.common.dto.ListingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@FeignClient(name = "listing-service")
public interface ListingServiceClient {

    @GetMapping("/api/listings/{listingId}")
    ListingResponse getListingById(@PathVariable("listingId") UUID listingId);

    @GetMapping("/api/listings/{listingId}/availability/check")
    Boolean checkAvailability(
            @PathVariable("listingId") UUID listingId,
            @RequestParam("checkIn") LocalDate checkIn,
            @RequestParam("checkOut") LocalDate checkOut);

    @PostMapping("/api/listings/{listingId}/availability/block")
    void blockDates(@PathVariable("listingId") UUID listingId, @RequestBody BlockDatesRequest request);

    @PostMapping("/api/listings/{listingId}/availability/unblock")
    void unblockDates(@PathVariable("listingId") UUID listingId, @RequestBody BlockDatesRequest request);
}
