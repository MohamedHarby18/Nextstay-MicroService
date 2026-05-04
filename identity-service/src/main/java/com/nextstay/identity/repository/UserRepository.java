package com.nextstay.identity.repository;

import com.nextstay.identity.entity.User;
import com.nextstay.identity.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    Boolean existsByEmail(String email);
}
