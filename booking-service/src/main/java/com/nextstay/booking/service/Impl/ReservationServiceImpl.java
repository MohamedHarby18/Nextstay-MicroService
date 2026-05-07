package com.nextstay.booking.service.Impl;

import com.nextstay.booking.client.ListingServiceClient;
import com.nextstay.common.dto.ApiResponse;
import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.dto.ReservationResponse;
import com.nextstay.booking.entity.Reservation;
import com.nextstay.booking.entity.ReservationStatus;
import com.nextstay.booking.exception.ForbiddenException;
import com.nextstay.booking.exception.ResourceNotFoundException;
import com.nextstay.booking.repository.ReservationRepository;
import com.nextstay.booking.service.ReservationService;
import com.nextstay.common.dto.ListingResponse;   // from nextstay-common (used by Feign)
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepo;
    private final ListingServiceClient listingClient;

    @Override
    @Transactional
    public ReservationResponse createReservation(UUID guestId, ReservationRequest request) {
        // Verify listing is ACTIVE via Listing Service
        ApiResponse<ListingResponse> listingApiResponse = listingClient.getListingById(request.getListingId());
        ListingResponse listing = (listingApiResponse != null) ? listingApiResponse.getData() : null;
        if (listing == null || !"ACTIVE".equals(listing.getStatus())) {
            throw new IllegalStateException("Listing is not available");
        }

        // Double-booking prevention #FR-10
        List<Reservation> allReservations = reservationRepo.findAll();
        boolean conflict = allReservations.stream()
            .filter(r -> r.getListingId().equals(request.getListingId()))
            .filter(r -> r.getStatus() != ReservationStatus.CANCELLED
                      && r.getStatus() != ReservationStatus.REJECTED)
            .anyMatch(r ->
                !(request.getCheckOutDate().isBefore(r.getCheckInDate()) ||
                  request.getCheckInDate().isAfter(r.getCheckOutDate()))
            );
        if (conflict) {
            throw new IllegalStateException("Selected dates are not available (double-booking prevented)");
        }

        // OCL constraint: check-out > check-in
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        Reservation reservation = Reservation.builder()
                .guestId(guestId)
                .listingId(request.getListingId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numGuests(request.getNumGuests())
                .status(ReservationStatus.PENDING)
                .build();
        reservation = reservationRepo.save(reservation);
        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse approveReservation(UUID reservationId, UUID hostId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only pending reservations can be approved");
        }

        // Verify that the caller is the host of the listing
        ApiResponse<ListingResponse> approveApiResponse = listingClient.getListingById(reservation.getListingId());
        ListingResponse listing = (approveApiResponse != null) ? approveApiResponse.getData() : null;
        if (listing == null || !listing.getHostId().equals(hostId)) {
            throw new ForbiddenException("Only the listing owner can approve this reservation");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepo.save(reservation);
        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse declineReservation(UUID reservationId, UUID hostId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only pending reservations can be declined");
        }

        ApiResponse<ListingResponse> declineApiResponse = listingClient.getListingById(reservation.getListingId());
        ListingResponse listing = (declineApiResponse != null) ? declineApiResponse.getData() : null;
        if (listing == null || !listing.getHostId().equals(hostId)) {
            throw new ForbiddenException("Only the listing owner can decline this reservation");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        reservationRepo.save(reservation);
        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse cancelReservation(UUID reservationId, UUID guestId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        // Only the guest who owns the reservation can cancel, and only when it's CONFIRMED
        if (!reservation.getGuestId().equals(guestId)) {
            throw new ForbiddenException("You can only cancel your own reservations");
        }
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalStateException("Only confirmed reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepo.save(reservation);
        return toResponse(reservation);
    }

    @Override
    public ReservationResponse getReservation(UUID reservationId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        return toResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getReservationsByUser(UUID userId) {
        return reservationRepo.findAll().stream()
                .filter(r -> r.getGuestId().equals(userId) || r.getGuestId().equals(userId))  // fix later: we need to know the role to decide whose reservations to show? For simplicity, filter by guestId only.
                .filter(r -> r.getGuestId().equals(userId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void completePastStays() {
        LocalDate today = LocalDate.now();
        List<Reservation> confirmed = reservationRepo.findAll().stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .filter(r -> r.getCheckOutDate().isBefore(today))
                .collect(Collectors.toList());
        confirmed.forEach(r -> r.setStatus(ReservationStatus.COMPLETED));
        reservationRepo.saveAll(confirmed);
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .guestId(r.getGuestId())
                .listingId(r.getListingId())
                .checkInDate(r.getCheckInDate())
                .checkOutDate(r.getCheckOutDate())
                .numGuests(r.getNumGuests())
                .status(r.getStatus().name())
                .createdAt(r.getCreatedAt())
                .build();
    }
}