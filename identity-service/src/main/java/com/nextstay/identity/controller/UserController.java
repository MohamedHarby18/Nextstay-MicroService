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

    // ─── Profile ──────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfileRequest request) {
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

    // ─── User Moderation (Users' Admin) ───────────────────────────────────────

    /** Flag a user (based on SA internal communication) */
    @PutMapping("/{id}/flag")
    public ResponseEntity<UserResponse> flagUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.flagUser(id));
    }

    /** Unflag a previously flagged user */
    @PutMapping("/{id}/unflag")
    public ResponseEntity<UserResponse> unflagUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.unflagUser(id));
    }

    /** Deactivate a user account (resolved deactivation ticket) */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Reactivate a previously deactivated account */
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<UserResponse> reactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.reactivateUser(id));
    }

    // ─── Internal endpoints — used by other microservices ─────────────────────

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> userExists(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.userExists(id));
    }

    @GetMapping("/{id}/role")
    public ResponseEntity<UserRole> getUserRole(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserRole(id));
    }

}
