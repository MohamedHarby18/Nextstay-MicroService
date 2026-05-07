package com.nextstay.support.dto;

import lombok.Data;

@Data
public class CreateTicketRequest {
    private String subject;
    private String description;
}