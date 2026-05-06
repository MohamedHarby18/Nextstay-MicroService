package com.nextstay.identity.service;

import com.nextstay.identity.dto.LoginRequest;
import com.nextstay.identity.dto.UserResponse;
import com.nextstay.common.exception.ConflictException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.identity.dto.AuthResponse;
import com.nextstay.identity.dto.RegisterRequest;
import com.nextstay.identity.entity.User;
import com.nextstay.identity.entity.UserRole;
import com.nextstay.identity.repository.UserRepository;
import com.nextstay.identity.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already taken");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? UserRole.valueOf(request.getRole().toUpperCase()) : UserRole.GUEST)
                .isVerified(false)
                .build();

        user = userRepository.save(user);

        return mapToUserResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getId().toString(),
                user.getRole().name(),
                "user"
        );

        return AuthResponse.builder()
                .accessToken(token)
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    public void verifyEmail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setIsVerified(true);
        user.setVerifiedAt(LocalDateTime.now());
        userRepository.save(user);
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
