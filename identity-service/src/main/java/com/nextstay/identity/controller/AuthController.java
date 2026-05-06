package com.nextstay.identity.controller;

import com.nextstay.identity.dto.LoginRequest;
import com.nextstay.identity.dto.UserResponse;
import com.nextstay.identity.dto.AuthResponse;
import com.nextstay.identity.dto.RegisterRequest;
import com.nextstay.identity.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify/{userId}")
    public ResponseEntity<Void> verifyEmail(@PathVariable UUID userId) {
        authService.verifyEmail(userId);
        return ResponseEntity.ok().build();
    }
}
