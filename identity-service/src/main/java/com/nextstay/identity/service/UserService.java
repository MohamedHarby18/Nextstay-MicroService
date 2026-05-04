package com.nextstay.identity.service;

import com.nextstay.common.dto.UpdateProfileRequest;
import com.nextstay.common.dto.UserResponse;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.identity.entity.User;
import com.nextstay.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
        
        user.setName(request.getName());
        user = userRepository.save(user);
        
        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
