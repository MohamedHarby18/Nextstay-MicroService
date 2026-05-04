package com.nextstay.common.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAgentRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String name;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    
    private String role;
}
