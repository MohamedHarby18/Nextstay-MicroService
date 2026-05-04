package com.nextstay.listing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingRequest {
    private String title;
    private String description;
    private String location;
    private BigDecimal pricePerNight;
    private Integer maxGuests;
}
