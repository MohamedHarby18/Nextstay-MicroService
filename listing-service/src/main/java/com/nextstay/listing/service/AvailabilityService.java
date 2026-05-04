package com.nextstay.listing.service;

import com.nextstay.listing.dto.AvailabilityRequest;
import com.nextstay.listing.dto.AvailabilityResponse;
import com.nextstay.listing.entity.AvailabilitySlot;
import com.nextstay.listing.repository.AvailabilitySlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilitySlotRepository availabilitySlotRepository;

    public AvailabilityResponse addAvailabilitySlot(UUID listingId, AvailabilityRequest request) {
        AvailabilitySlot slot = AvailabilitySlot.builder()
                .listingId(listingId)
                .slotDate(request.getSlotDate())
                .isBlocked(request.getIsBlocked() != null ? request.getIsBlocked() : false)
                .build();

        slot = availabilitySlotRepository.save(slot);
        return mapToAvailabilityResponse(slot);
    }

    public List<AvailabilityResponse> getAvailableSlots(UUID listingId) {
        return availabilitySlotRepository.findByListingIdAndIsBlockedFalse(listingId).stream()
                .map(this::mapToAvailabilityResponse)
                .collect(Collectors.toList());
    }

    public Boolean checkAvailability(UUID listingId, LocalDate checkIn, LocalDate checkOut) {
        // Find if there are any blocked slots between checkIn and checkOut (exclusive of checkOut)
        LocalDate endDate = checkOut.minusDays(1); // checkout day itself doesn't need to be available for a night's stay
        List<AvailabilitySlot> slots = availabilitySlotRepository.findByListingIdAndSlotDateBetween(listingId, checkIn, endDate);
        
        // If there are blocked slots in the range, return false
        boolean hasBlocked = slots.stream().anyMatch(AvailabilitySlot::getIsBlocked);
        return !hasBlocked;
    }

    public void blockDates(UUID listingId, LocalDate checkIn, LocalDate checkOut) {
        LocalDate currentDate = checkIn;
        while (currentDate.isBefore(checkOut)) {
            LocalDate date = currentDate;
            List<AvailabilitySlot> existingSlots = availabilitySlotRepository.findByListingIdAndSlotDateBetween(listingId, date, date);
            
            if (existingSlots.isEmpty()) {
                AvailabilitySlot newSlot = AvailabilitySlot.builder()
                        .listingId(listingId)
                        .slotDate(date)
                        .isBlocked(true)
                        .build();
                availabilitySlotRepository.save(newSlot);
            } else {
                AvailabilitySlot slot = existingSlots.get(0);
                slot.setIsBlocked(true);
                availabilitySlotRepository.save(slot);
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    public void unblockDates(UUID listingId, LocalDate checkIn, LocalDate checkOut) {
        LocalDate currentDate = checkIn;
        while (currentDate.isBefore(checkOut)) {
            LocalDate date = currentDate;
            List<AvailabilitySlot> existingSlots = availabilitySlotRepository.findByListingIdAndSlotDateBetween(listingId, date, date);
            
            if (!existingSlots.isEmpty()) {
                AvailabilitySlot slot = existingSlots.get(0);
                slot.setIsBlocked(false);
                availabilitySlotRepository.save(slot);
            }
            currentDate = currentDate.plusDays(1);
        }
    }

    private AvailabilityResponse mapToAvailabilityResponse(AvailabilitySlot slot) {
        return AvailabilityResponse.builder()
                .id(slot.getId())
                .listingId(slot.getListingId())
                .slotDate(slot.getSlotDate())
                .isBlocked(slot.getIsBlocked())
                .build();
    }
}
