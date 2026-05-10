package com.nextstay.booking.controller;

import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.dto.ReservationResponse;
import com.nextstay.booking.service.ReservationService;
import jakarta.validation.Valid;
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

    /** FR-09: Create a reservation (Guest only) */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestHeader("X-User-Id") UUID guestId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody ReservationRequest request) {
        
        if (!"GUEST".equalsIgnoreCase(role)) {
            throw new SecurityException("Only guests can create bookings");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(guestId, request));
    }

    /** FR-11: Host approve reservation */
    @PutMapping("/{id}/approve")
    public ResponseEntity<ReservationResponse> approveReservation(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID hostId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"HOST".equalsIgnoreCase(role)) {
            throw new SecurityException("Only hosts can approve reservations");
        }
        return ResponseEntity.ok(reservationService.approveReservation(id, hostId));
    }

    /** FR-11: Host decline reservation (Fixed logic) */
    @PutMapping("/{id}/decline")
    public ResponseEntity<ReservationResponse> declineReservation(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID hostId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"HOST".equalsIgnoreCase(role)) {
            throw new SecurityException("Only hosts can decline reservations");
        }
        return ResponseEntity.ok(reservationService.declineReservation(id, hostId));
    }

    /** FR-11: Guest cancel (only when confirmed) */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID guestId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"GUEST".equalsIgnoreCase(role)) {
            throw new SecurityException("Only guests can cancel reservations");
        }
        return ResponseEntity.ok(reservationService.cancelReservation(id, guestId));
    }

    /** Get my reservations (Dynamic for both Guest and Host) */
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestHeader("X-User-Role") String role) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getReservation(id));
    }

    // ─── Internal endpoints — used by other microservices ───

    @GetMapping("/{reservationId}/verify-completed")
    public ResponseEntity<Boolean> verifyReservationCompleted(@PathVariable UUID reservationId) {
        ReservationResponse reservation = reservationService.getReservation(reservationId);
        return ResponseEntity.ok("COMPLETED".equalsIgnoreCase(reservation.getStatus()));
    }

    @GetMapping("/{reservationId}/guest/{guestId}/verify")
    public ResponseEntity<Boolean> verifyReservationOwnership(
            @PathVariable UUID reservationId,
            @PathVariable UUID guestId) {
        ReservationResponse reservation = reservationService.getReservation(reservationId);
        return ResponseEntity.ok(guestId.equals(reservation.getGuestId()));
    }
}