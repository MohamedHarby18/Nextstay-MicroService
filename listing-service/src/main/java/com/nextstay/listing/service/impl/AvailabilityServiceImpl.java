package com.nextstay.listing.service.impl;

import com.nextstay.listing.dto.request.AvailabilityRequestDto;
import com.nextstay.listing.dto.response.AvailabilityResponseDto;
import com.nextstay.listing.entity.*;
import com.nextstay.listing.exception.*;
import com.nextstay.listing.repository.*;
import com.nextstay.listing.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilitySlotRepository availRepo;
    private final ListingRepository listingRepo;

    @Override
    public List<AvailabilityResponseDto> getAvailableSlots(UUID listingId) {
        return availRepo.findByListingIdAndIsBlockedFalse(listingId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean checkAvailability(UUID listingId, LocalDate checkIn, LocalDate checkOut) {
        // Check if any blocked slots exist in the date range
        List<AvailabilitySlot> blocked = availRepo.findByListingIdAndSlotDateBetween(listingId, checkIn, checkOut)
                .stream()
                .filter(AvailabilitySlot::getIsBlocked)
                .collect(Collectors.toList());
        return blocked.isEmpty();   // true if no blocked dates
    }

    @Override
@Transactional
public void blockDates(UUID listingId, LocalDate start, LocalDate end) {
    List<AvailabilitySlot> existingSlots = availRepo.findByListingIdAndSlotDateBetween(listingId, start, end);
    Set<LocalDate> existingDates = existingSlots.stream().map(AvailabilitySlot::getSlotDate).collect(Collectors.toSet());

    List<AvailabilitySlot> toSave = new ArrayList<>();
    LocalDate date = start;
    while (!date.isAfter(end)) {
        final LocalDate currentDate = date; // effectively final copy
        if (!existingDates.contains(currentDate)) {
            AvailabilitySlot slot = AvailabilitySlot.builder()
                    .listingId(listingId)
                    .slotDate(currentDate)
                    .isBlocked(true)
                    .build();
            toSave.add(slot);
        } else {
            existingSlots.stream()
                    .filter(s -> s.getSlotDate().equals(currentDate))
                    .findFirst()
                    .ifPresent(s -> s.setIsBlocked(true));
        }
        date = date.plusDays(1);
    }
    availRepo.saveAll(toSave);
}

    @Override
    @Transactional
    public void unblockDates(UUID listingId, LocalDate start, LocalDate end) {
        List<AvailabilitySlot> slots = availRepo.findByListingIdAndSlotDateBetween(listingId, start, end);
        slots.forEach(s -> s.setIsBlocked(false));
        availRepo.saveAll(slots);
    }

    @Override
    @Transactional
public void manageAvailability(UUID listingId, AvailabilityRequestDto request, UUID userId) {
    if (!listingRepo.existsById(listingId)) {
        throw new ResourceNotFoundException("Listing not found");
    }
    // Role-based authorization (host or admin) is handled in the controller
    if (request.getBlock()) {
        blockDates(listingId, request.getStartDate(), request.getEndDate());
    } else {
        unblockDates(listingId, request.getStartDate(), request.getEndDate());
    }
}

    private AvailabilityResponseDto toDto(AvailabilitySlot slot) {
        return AvailabilityResponseDto.builder()
                .id(slot.getId())
                .listingId(slot.getListingId())
                .slotDate(slot.getSlotDate())
                .blocked(slot.getIsBlocked())
                .build();
    }
}