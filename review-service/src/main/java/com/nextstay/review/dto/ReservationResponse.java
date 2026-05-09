package com.nextstay.review.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ReservationResponse {
    private UUID id;
    private UUID guestId;
    private UUID listingId;
    private String status;
}
