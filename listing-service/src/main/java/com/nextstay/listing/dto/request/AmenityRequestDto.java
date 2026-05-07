package com.nextstay.listing.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AmenityRequestDto {
    @NotBlank(message = "Amenity name is required")
    private String name;
}