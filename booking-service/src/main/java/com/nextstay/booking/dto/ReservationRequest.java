package com.nextstay.booking.dto;

import jakarta.validation.constraints.Future;
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
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;

    @NotNull
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @Min(1)
    private int numGuests;
}