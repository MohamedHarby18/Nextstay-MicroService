package com.nextstay.listing.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

/**
 * Feign client for calling the Booking Service to check date availability
 * during property search (FR-06).
 */
@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    /**
     * Returns a list of date strings (yyyy-MM-dd) that are already reserved
     * (Confirmed or Pending) for the given listing between the given range.
     */
    @GetMapping("/api/bookings/reserved-dates/{listingId}")
    List<LocalDate> getReservedDates(
            @PathVariable("listingId") Long listingId,
            @RequestParam("checkIn") LocalDate checkIn,
            @RequestParam("checkOut") LocalDate checkOut
    );
}
