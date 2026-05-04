package com.nextstay.identity.repository;

import com.nextstay.identity.entity.Agent;
import com.nextstay.identity.entity.AgentRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AgentRepository extends JpaRepository<Agent, UUID> {
    Optional<Agent> findByEmail(String email);
    List<Agent> findByRole(AgentRole role);
    List<Agent> findByIsActiveTrue();
    Boolean existsByEmail(String email);
}
