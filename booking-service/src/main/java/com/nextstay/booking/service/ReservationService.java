package com.nextstay.booking.service;

import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.dto.ReservationResponse;

import java.util.List;
import java.util.UUID;

public interface ReservationService {
    ReservationResponse createReservation(UUID guestId, ReservationRequest request);
    ReservationResponse approveReservation(UUID reservationId, UUID hostId);
    ReservationResponse declineReservation(UUID reservationId, UUID hostId);
    ReservationResponse cancelReservation(UUID reservationId, UUID guestId);
    ReservationResponse getReservation(UUID reservationId);
    List<ReservationResponse> getReservationsByUser(UUID userId, String role);    
    void completePastStays();   // called by scheduler
}
