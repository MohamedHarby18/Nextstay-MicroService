package com.nextstay.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic wrapper that mirrors the ApiResponse<T> returned by listing-service
 * (and other services). Used by Feign clients to unwrap the payload correctly.
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;
}
