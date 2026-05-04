package com.nextstay.review.client;

import com.nextstay.common.dto.ListingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "listing-service")
public interface ListingServiceClient {

    @GetMapping("/api/listings/{listingId}")
    ListingResponse getListingById(@PathVariable("listingId") UUID listingId);

    @PutMapping("/api/listings/{listingId}/rating")
    void updateAverageRating(@PathVariable("listingId") UUID listingId, @RequestParam("newRating") Double newRating);
}
