package com.nextstay.booking.controller;

import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.service.ReservationService;
import com.nextstay.common.dto.ReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestHeader("X-User-Id") UUID guestId,
            @RequestBody ReservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.createReservation(guestId, request));
    }

    @PutMapping("/{reservationId}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable UUID reservationId,
            @RequestHeader("X-User-Id") UUID guestId) {
        return ResponseEntity.ok(reservationService.cancelReservation(reservationId, guestId));
    }

    @PutMapping("/{reservationId}/complete")
    public ResponseEntity<ReservationResponse> completeReservation(@PathVariable UUID reservationId) {
        return ResponseEntity.ok(reservationService.completeReservation(reservationId));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable UUID reservationId) {
        return ResponseEntity.ok(reservationService.getReservationById(reservationId));
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByGuest(@PathVariable UUID guestId) {
        return ResponseEntity.ok(reservationService.getReservationsByGuest(guestId));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByListing(@PathVariable UUID listingId) {
        return ResponseEntity.ok(reservationService.getReservationsByListing(listingId));
    }

    // INTERNAL ENDPOINT
    @GetMapping("/{reservationId}/verify-completed")
    public ResponseEntity<Boolean> verifyReservationCompleted(@PathVariable UUID reservationId) {
        return ResponseEntity.ok(reservationService.verifyReservationCompleted(reservationId));
    }
}
