package com.nextstay.listing.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ListingResponseDto {
    private UUID id;
    private UUID hostId;
    private String title;
    private String description;
    private String location;
    private List<String> amenities;      // from Amenity entities
    private BigDecimal pricePerNight;
    private Integer maxGuests;
    private String status;
    private Double averageRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}