package com.nextstay.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockDatesRequest {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
