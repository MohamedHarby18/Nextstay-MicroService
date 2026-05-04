package com.nextstay.listing.service;

import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.listing.dto.AmenityRequest;
import com.nextstay.listing.dto.AmenityResponse;
import com.nextstay.listing.entity.Amenity;
import com.nextstay.listing.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityResponse addAmenity(UUID listingId, AmenityRequest request) {
        Amenity amenity = Amenity.builder()
                .listingId(listingId)
                .name(request.getName())
                .build();

        amenity = amenityRepository.save(amenity);
        return mapToAmenityResponse(amenity);
    }

    public void removeAmenity(UUID amenityId) {
        if (!amenityRepository.existsById(amenityId)) {
            throw new ResourceNotFoundException("Amenity not found");
        }
        amenityRepository.deleteById(amenityId);
    }

    public List<AmenityResponse> getAmenitiesByListing(UUID listingId) {
        return amenityRepository.findByListingId(listingId).stream()
                .map(this::mapToAmenityResponse)
                .collect(Collectors.toList());
    }

    private AmenityResponse mapToAmenityResponse(Amenity amenity) {
        return AmenityResponse.builder()
                .id(amenity.getId())
                .listingId(amenity.getListingId())
                .name(amenity.getName())
                .build();
    }
}
