package com.nextstay.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private UUID id;
    private UUID guestId;
    private UUID listingId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numGuests;
    private String status;
    private LocalDateTime createdAt;
}
