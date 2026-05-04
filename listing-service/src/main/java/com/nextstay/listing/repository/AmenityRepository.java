package com.nextstay.listing.repository;

import com.nextstay.listing.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {
    List<Amenity> findByListingId(UUID listingId);
    void deleteByListingId(UUID listingId);
}
