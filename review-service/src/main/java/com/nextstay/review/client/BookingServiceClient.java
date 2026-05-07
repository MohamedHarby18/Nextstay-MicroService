package com.nextstay.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    @GetMapping("/api/reservations/{reservationId}/verify-completed")
    Boolean verifyReservationCompleted(@PathVariable("reservationId") UUID reservationId);

    // Security check: ensure the reservation belongs to the requesting guest
    @GetMapping("/api/reservations/{reservationId}/guest/{guestId}/verify")
    Boolean verifyReservationOwnership(
            @PathVariable("reservationId") UUID reservationId,
            @PathVariable("guestId") UUID guestId);
}
