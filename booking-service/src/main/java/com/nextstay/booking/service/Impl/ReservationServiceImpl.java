package com.nextstay.booking.service.Impl;

import com.nextstay.booking.client.ListingServiceClient;
import com.nextstay.common.dto.ApiResponse;
import com.nextstay.common.dto.ListingResponse;
import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.dto.ReservationResponse;
import com.nextstay.booking.entity.Reservation;
import com.nextstay.booking.entity.ReservationStatus;
import com.nextstay.booking.exception.ForbiddenException;
import com.nextstay.booking.exception.ResourceNotFoundException;
import com.nextstay.booking.repository.ReservationRepository;
import com.nextstay.booking.service.ReservationService;
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
        // 1. Verify listing is ACTIVE
        ApiResponse<ListingResponse> listingApiResponse = listingClient.getListingById(request.getListingId());
        ListingResponse listing = (listingApiResponse != null) ? listingApiResponse.getData() : null;
        if (listing == null || !"ACTIVE".equals(listing.getStatus())) {
            throw new IllegalStateException("Listing is not available for booking");
        }

        // 2. Double-booking prevention
        boolean conflict = !reservationRepo.findOverlapping(
                request.getListingId(),
                List.of(ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED),
                request.getCheckOutDate(),
                request.getCheckInDate()
        ).isEmpty();
        
        if (conflict) {
            throw new IllegalStateException("Selected dates are no longer available");
        }

        // 3. Date logic check
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

        return toResponse(reservationRepo.save(reservation));
    }

    @Override
    @Transactional
    public ReservationResponse approveReservation(UUID reservationId, UUID hostId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only pending reservations can be approved");
        }

        ApiResponse<ListingResponse> res = listingClient.getListingById(reservation.getListingId());
        ListingResponse listing = (res != null) ? res.getData() : null;
        
        // Ownership check using String comparison to avoid type mismatches
        if (listing == null || !listing.getHostId().toString().equals(hostId.toString())) {
            throw new ForbiddenException("Unauthorized: You do not own this listing");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        return toResponse(reservationRepo.save(reservation));
    }

    @Override
    @Transactional
    public ReservationResponse declineReservation(UUID reservationId, UUID hostId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only pending reservations can be declined");
        }

        ApiResponse<ListingResponse> res = listingClient.getListingById(reservation.getListingId());
        ListingResponse listing = (res != null) ? res.getData() : null;
        
        if (listing == null || !listing.getHostId().toString().equals(hostId.toString())) {
            throw new ForbiddenException("Unauthorized: You do not own this listing");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        return toResponse(reservationRepo.save(reservation));
    }

    @Override
    public List<ReservationResponse> getReservationsByUser(UUID userId, String role) {
        if ("GUEST".equalsIgnoreCase(role)) {
            return reservationRepo.findByGuestId(userId).stream()
                    .map(this::toResponse).collect(Collectors.toList());
        }

        if ("HOST".equalsIgnoreCase(role)) {
            ApiResponse<List<ListingResponse>> hostListingsRes = listingClient.getListingsByHost(userId);
            List<ListingResponse> listings = (hostListingsRes != null) ? hostListingsRes.getData() : List.of();
            
            List<UUID> listingIds = listings.stream().map(ListingResponse::getId).collect(Collectors.toList());
            if (listingIds.isEmpty()) return List.of();

            return reservationRepo.findByListingIdIn(listingIds).stream()
                    .map(this::toResponse).collect(Collectors.toList());
        }
        return List.of();
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId()).guestId(r.getGuestId()).listingId(r.getListingId())
                .checkInDate(r.getCheckInDate()).checkOutDate(r.getCheckOutDate())
                .numGuests(r.getNumGuests()) // FIXED: Correct getter name
                .status(r.getStatus().name()).createdAt(r.getCreatedAt()).build();
    }

    @Override
    @Transactional
    public ReservationResponse cancelReservation(UUID reservationId, UUID guestId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getGuestId().equals(guestId)) {
            throw new ForbiddenException("You can only cancel your own reservations");
        }
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalStateException("Only confirmed reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return toResponse(reservationRepo.save(reservation));
    }

    @Override
    public ReservationResponse getReservation(UUID reservationId) {
        return toResponse(reservationRepo.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found")));
    }

    @Override
    @Transactional
    public void completePastStays() {
        LocalDate today = LocalDate.now();
        List<Reservation> pastStays = reservationRepo.findAll().stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .filter(r -> r.getCheckOutDate().isBefore(today))
                .toList();
        
        pastStays.forEach(r -> r.setStatus(ReservationStatus.COMPLETED));
        reservationRepo.saveAll(pastStays);
    }
}