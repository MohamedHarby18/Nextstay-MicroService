package com.nextstay.listing.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class ListingUpdateRequestDto {
    private String title;
    private String description;
    private String location;
    private List<String> amenities;
    @DecimalMin(value = "0.01")
    private Double pricePerNight;
    @Min(1)
    private Integer maxGuests;
}