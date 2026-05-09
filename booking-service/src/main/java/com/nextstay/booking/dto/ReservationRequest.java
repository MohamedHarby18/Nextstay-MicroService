package com.nextstay.booking.dto;

import jakarta.validation.constraints.FutureOrPresent; // Changed from Future
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ReservationRequest {
    @NotNull
    private UUID listingId;

    @NotNull
    @FutureOrPresent(message = "Check-in date cannot be in the past")
    private LocalDate checkInDate;

    @NotNull
    @FutureOrPresent(message = "Check-out date cannot be in the past")
    private LocalDate checkOutDate;

    @Min(1)
    private int numGuests;
}