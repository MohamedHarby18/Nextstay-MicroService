package com.nextstay.identity.dto;

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
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private String bio;
    private String profilePhoto;
    private String role;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
