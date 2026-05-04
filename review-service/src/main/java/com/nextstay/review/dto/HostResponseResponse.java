package com.nextstay.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HostResponseResponse {
    private UUID id;
    private UUID reviewId;
    private UUID hostId;
    private String responseText;
    private LocalDateTime createdAt;
}
