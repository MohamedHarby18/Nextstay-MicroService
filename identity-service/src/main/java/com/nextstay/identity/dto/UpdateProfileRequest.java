package com.nextstay.identity.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    private String phoneNumber;

    private String bio;

    private String profilePhoto;

    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;

    private String oldPassword;
}
