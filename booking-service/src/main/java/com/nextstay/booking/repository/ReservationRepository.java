package com.nextstay.booking.repository;

import com.nextstay.booking.entity.Reservation;
import com.nextstay.booking.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
       List<Reservation> findByGuestId(UUID guestId);
       List<Reservation> findByListingId(UUID listingId);
       List<Reservation> findByGuestIdAndStatus(UUID guestId, ReservationStatus status);
       List<Reservation> findByListingIdAndStatus(UUID listingId, ReservationStatus status);
       List<Reservation> findByListingIdIn(List<UUID> listingIds);
    @Query("SELECT r FROM Reservation r WHERE r.listingId = :listingId AND r.status IN :statuses " +
           "AND r.checkInDate < :checkOut AND r.checkOutDate > :checkIn")
    List<Reservation> findOverlapping(
            @Param("listingId") UUID listingId,
            @Param("statuses") List<ReservationStatus> statuses,
            @Param("checkOut") LocalDate checkOut,
            @Param("checkIn") LocalDate checkIn);
}
