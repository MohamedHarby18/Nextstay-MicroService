package com.nextstay.listing.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class ListingRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private List<String> amenities;   // amenity names

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price must be > 0")
    private Double pricePerNight;

    @NotNull(message = "Max guests is required")
    @Min(value = 1, message = "Max guests must be at least 1")
    private Integer maxGuests;
}