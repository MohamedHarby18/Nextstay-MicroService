package com.nextstay.support.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank
    
    private String subject;
    @NotBlank
    private String description;
    @NotNull
    private String category; // billing, booking, listing, other
}