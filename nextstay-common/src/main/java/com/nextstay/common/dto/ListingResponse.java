package com.nextstay.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {
    private UUID id;
    private UUID hostId;
    private String title;
    private String location;
    private BigDecimal pricePerNight;
    private Integer maxGuests;
    private String status;
    private Double averageRating;
}
