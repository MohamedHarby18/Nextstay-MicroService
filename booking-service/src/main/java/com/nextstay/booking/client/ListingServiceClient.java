package com.nextstay.booking.client;

import com.nextstay.common.dto.ApiResponse;
import com.nextstay.common.dto.ListingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.UUID;

@FeignClient(name = "listing-service")
public interface ListingServiceClient {

    @GetMapping("/api/listings/{listingId}")
    ApiResponse<ListingResponse> getListingById(@PathVariable UUID listingId);

    // ADDED: Fetch all listings owned by a host to filter reservations
    @GetMapping("/api/listings/host/{hostId}")
    ApiResponse<List<ListingResponse>> getListingsByHost(@PathVariable UUID hostId);
}