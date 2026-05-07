package com.nextstay.listing.service.impl;

import com.nextstay.listing.dto.request.AmenityRequestDto;
import com.nextstay.listing.dto.response.AmenityResponseDto;
import com.nextstay.listing.entity.*;
import com.nextstay.listing.exception.ResourceNotFoundException;
import com.nextstay.listing.repository.*;
import com.nextstay.listing.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepo;

    @Override
    public AmenityResponseDto addAmenity(UUID listingId, AmenityRequestDto request) {
        Amenity amenity = Amenity.builder()
                .listingId(listingId)
                .name(request.getName())
                .build();
        amenity = amenityRepo.save(amenity);
        return toDto(amenity);
    }

    @Override
    public void removeAmenity(UUID amenityId) {
        if (!amenityRepo.existsById(amenityId))
            throw new ResourceNotFoundException("Amenity not found");
        amenityRepo.deleteById(amenityId);
    }

    @Override
    public List<AmenityResponseDto> getAmenitiesByListing(UUID listingId) {
        return amenityRepo.findByListingId(listingId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private AmenityResponseDto toDto(Amenity a) {
        return AmenityResponseDto.builder()
                .id(a.getId())
                .listingId(a.getListingId())
                .name(a.getName())
                .build();
    }
}