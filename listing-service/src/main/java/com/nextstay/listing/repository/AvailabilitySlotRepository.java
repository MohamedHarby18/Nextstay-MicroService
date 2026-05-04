package com.nextstay.listing.repository;

import com.nextstay.listing.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {
    List<AvailabilitySlot> findByListingIdAndIsBlockedFalse(UUID listingId);
    List<AvailabilitySlot> findByListingIdAndSlotDateBetween(UUID listingId, LocalDate start, LocalDate end);
    List<AvailabilitySlot> findByListingIdAndIsBlockedFalseAndSlotDateBetween(UUID listingId, LocalDate start, LocalDate end);
}
