package com.nextstay.identity.controller;

import com.nextstay.identity.dto.UpdateProfileRequest;
import com.nextstay.identity.dto.UserResponse;
import com.nextstay.identity.entity.UserRole;
import com.nextstay.identity.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable UUID id, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // INTERNAL ENDPOINTS — used by other microservices
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> userExists(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.userExists(id));
    }

    @GetMapping("/{id}/role")
    public ResponseEntity<UserRole> getUserRole(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserRole(id));
    }
}
