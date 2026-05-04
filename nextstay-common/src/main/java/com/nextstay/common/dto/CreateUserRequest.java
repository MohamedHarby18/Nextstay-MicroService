package com.nextstay.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String role;
}
