package com.nextstay.listing.repository;

import com.nextstay.listing.entity.Listing;
import com.nextstay.listing.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {
    List<Listing> findByHostId(UUID hostId);
    List<Listing> findByStatus(ListingStatus status);
    List<Listing> findByLocationContainingIgnoreCaseAndStatus(String location, ListingStatus status);
    List<Listing> findByPricePerNightBetweenAndStatus(BigDecimal min, BigDecimal max, ListingStatus status);
}
