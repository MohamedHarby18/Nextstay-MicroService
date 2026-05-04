package com.nextstay.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {
    @NotBlank
    private String messageText;
}