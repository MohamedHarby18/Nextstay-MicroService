package com.nextstay.booking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReservationResponse {
    private UUID id;
    private UUID guestId;
    private UUID listingId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numGuests;
    private String status;          // PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED
    private LocalDateTime createdAt;
}