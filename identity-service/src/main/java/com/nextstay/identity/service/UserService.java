package com.nextstay.identity.service;

import com.nextstay.identity.dto.UpdateProfileRequest;
import com.nextstay.identity.dto.UserResponse;
import com.nextstay.common.exception.BadRequestException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.identity.entity.User;
import com.nextstay.identity.entity.UserRole;
import com.nextstay.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse updateProfile(UUID id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Handle name update
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getProfilePhoto() != null) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        // Handle password change
        if (request.getNewPassword() != null) {
            if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                throw new BadRequestException("Old password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                throw new UnauthorizedException("Old password is incorrect");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public boolean userExists(UUID id) {
        return userRepository.existsById(id);
    }

    public UserRole getUserRole(UUID id) {
        return userRepository.findById(id)
                .map(User::getRole)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .profilePhoto(user.getProfilePhoto())
                .role(user.getRole().name())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
