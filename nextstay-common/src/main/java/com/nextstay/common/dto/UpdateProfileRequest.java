package com.nextstay.common.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String bio;
    private String profilePhoto;
    private String oldPassword;
    private String newPassword;
}
