package com.nextstay.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    private UUID listingId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numGuests;
}
