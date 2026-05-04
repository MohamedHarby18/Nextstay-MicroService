package com.nextstay.identity.service;

import com.nextstay.common.dto.AgentResponse;
import com.nextstay.common.exception.ConflictException;
import com.nextstay.common.exception.ResourceNotFoundException;
import com.nextstay.common.exception.UnauthorizedException;
import com.nextstay.common.security.JwtTokenProvider;
import com.nextstay.identity.client.SupportServiceClient;
import com.nextstay.identity.dto.AgentLoginRequest;
import com.nextstay.identity.dto.AgentRegisterRequest;
import com.nextstay.identity.dto.AuthResponse;
import com.nextstay.identity.entity.Agent;
import com.nextstay.identity.entity.AgentRole;
import com.nextstay.identity.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final SupportServiceClient supportServiceClient;

    public AgentResponse registerAgent(AgentRegisterRequest request) {
        if (agentRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already taken");
        }

        Agent agent = Agent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? AgentRole.valueOf(request.getRole().toUpperCase()) : AgentRole.SUPPORT_AGENT)
                .isActive(true)
                .build();

        agent = agentRepository.save(agent);
        return mapToAgentResponse(agent);
    }

    public AuthResponse loginAgent(AgentLoginRequest request) {
        Agent agent = agentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), agent.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!agent.getIsActive()) {
            throw new UnauthorizedException("Agent account is deactivated");
        }

        agent.setLastLoginAt(LocalDateTime.now());
        agentRepository.save(agent);

        String token = jwtTokenProvider.generateToken(
                agent.getEmail(),
                agent.getId().toString(),
                agent.getRole().name(),
                "agent"
        );

        return AuthResponse.builder()
                .accessToken(token)
                .userId(agent.getId())
                .role(agent.getRole().name())
                .build();
    }

    public AgentResponse getAgentById(UUID id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        return mapToAgentResponse(agent);
    }

    public List<AgentResponse> getAllAgents() {
        return agentRepository.findAll().stream()
                .map(this::mapToAgentResponse)
                .collect(Collectors.toList());
    }

    public List<AgentResponse> getAllActiveAgents() {
        return agentRepository.findByIsActiveTrue().stream()
                .map(this::mapToAgentResponse)
                .collect(Collectors.toList());
    }

    public AgentResponse updateAgentRole(UUID id, AgentRole newRole) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        
        agent.setRole(newRole);
        agent = agentRepository.save(agent);
        
        return mapToAgentResponse(agent);
    }

    public void deactivateAgent(UUID id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        
        agent.setIsActive(false);
        agentRepository.save(agent);

        try {
            supportServiceClient.unassignTicketsForAgent(id);
        } catch (Exception e) {
            // Log error but don't fail deactivation
            System.err.println("Failed to unassign tickets for agent " + id + ": " + e.getMessage());
        }
    }

    private AgentResponse mapToAgentResponse(Agent agent) {
        return AgentResponse.builder()
                .id(agent.getId())
                .name(agent.getName())
                .email(agent.getEmail())
                .role(agent.getRole().name())
                .isActive(agent.getIsActive())
                .createdAt(agent.getCreatedAt())
                .build();
    }
}
