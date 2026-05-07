package com.nextstay.booking.service;

import com.nextstay.booking.dto.ReservationRequest;
import com.nextstay.booking.dto.ReservationResponse;

import java.util.List;
import java.util.UUID;

<<<<<<< HEAD
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ListingServiceClient listingServiceClient;

    public ReservationResponse createReservation(UUID guestId, ReservationRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be strictly after check-in date");
        }
        if (request.getNumGuests() <= 0) {
            throw new BadRequestException("Number of guests must be greater than 0");
        }

        // 1. Get listing details
        ListingResponse listing = listingServiceClient.getListingById(request.getListingId());

        // 2. Validate guests
        if (request.getNumGuests() > listing.getMaxGuests()) {
            throw new BadRequestException("Number of guests exceeds listing maximum capacity");
        }

        // 3. Check availability via listing-service
        Boolean isAvailable = listingServiceClient.checkAvailability(
                request.getListingId(), request.getCheckInDate(), request.getCheckOutDate());
        if (!isAvailable) {
            throw new ConflictException("Listing is not available for the selected dates");
        }

        // 4. Check for overlapping local reservations
        List<Reservation> overlapping = reservationRepository.findOverlapping(
                request.getListingId(),
                Arrays.asList(ReservationStatus.PENDING, ReservationStatus.CONFIRMED),
                request.getCheckOutDate(),
                request.getCheckInDate());
        if (!overlapping.isEmpty()) {
            throw new ConflictException("There are overlapping reservations for the selected dates");
        }

        // 5. Save reservation as PENDING
        Reservation reservation = Reservation.builder()
                .guestId(guestId)
                .listingId(request.getListingId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numGuests(request.getNumGuests())
                .status(ReservationStatus.PENDING)
                .build();
        reservation = reservationRepository.save(reservation);

        // 6. Block dates
        BlockDatesRequest blockRequest = new BlockDatesRequest(request.getCheckInDate(), request.getCheckOutDate());
        listingServiceClient.blockDates(request.getListingId(), blockRequest);

        // 7. Update to CONFIRMED
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation = reservationRepository.save(reservation);

        return mapToReservationResponse(reservation);
    }

    public ReservationResponse cancelReservation(UUID reservationId, UUID guestId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getGuestId().equals(guestId)) {
            throw new UnauthorizedException("Only the guest who made the reservation can cancel it");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation = reservationRepository.save(reservation);

        // Unblock dates
        BlockDatesRequest unblockRequest = new BlockDatesRequest(reservation.getCheckInDate(),
                reservation.getCheckOutDate());
        try {
            listingServiceClient.unblockDates(reservation.getListingId(), unblockRequest);
        } catch (Exception e) {
            // Log but don't fail cancellation
            System.err.println("Failed to unblock dates in listing-service: " + e.getMessage());
        }

        return mapToReservationResponse(reservation);
    }

    public ReservationResponse completeReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (LocalDate.now().isBefore(reservation.getCheckOutDate())) {
            throw new BadRequestException("Cannot complete a reservation before its check-out date");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservation = reservationRepository.save(reservation);

        return mapToReservationResponse(reservation);
    }

    public ReservationResponse getReservationById(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        return mapToReservationResponse(reservation);
    }

    public List<ReservationResponse> getReservationsByGuest(UUID guestId) {
        return reservationRepository.findByGuestId(guestId).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsByListing(UUID listingId) {
        return reservationRepository.findByListingId(listingId).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    public Boolean verifyReservationCompleted(UUID reservationId) {
        return reservationRepository.findById(reservationId)
                .map(r -> r.getStatus() == ReservationStatus.COMPLETED)
                .orElse(false);
    }

    private ReservationResponse mapToReservationResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .guestId(reservation.getGuestId())
                .listingId(reservation.getListingId())
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .numGuests(reservation.getNumGuests())
                .status(reservation.getStatus().name())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
=======
public interface ReservationService {
    ReservationResponse createReservation(UUID guestId, ReservationRequest request);
    ReservationResponse approveReservation(UUID reservationId, UUID hostId);
    ReservationResponse declineReservation(UUID reservationId, UUID hostId);
    ReservationResponse cancelReservation(UUID reservationId, UUID guestId);
    ReservationResponse getReservation(UUID reservationId);
    List<ReservationResponse> getReservationsByUser(UUID userId);
    void completePastStays();   // called by scheduler
}
>>>>>>> 0c0cf32da1d9b2356876779621f6aad5256bae7e
