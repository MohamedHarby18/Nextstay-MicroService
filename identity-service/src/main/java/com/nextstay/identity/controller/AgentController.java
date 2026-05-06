package com.nextstay.identity.controller;

import com.nextstay.identity.dto.AgentResponse;
import com.nextstay.identity.dto.AgentLoginRequest;
import com.nextstay.identity.dto.AgentRegisterRequest;
import com.nextstay.identity.dto.AuthResponse;
import com.nextstay.identity.entity.AgentRole;
import com.nextstay.identity.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @PostMapping("/register")
    public ResponseEntity<AgentResponse> registerAgent(@Valid @RequestBody AgentRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentService.registerAgent(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginAgent(@Valid @RequestBody AgentLoginRequest request) {
        return ResponseEntity.ok(agentService.loginAgent(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentResponse> getAgentById(@PathVariable UUID id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @GetMapping
    public ResponseEntity<List<AgentResponse>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AgentResponse>> getAllActiveAgents() {
        return ResponseEntity.ok(agentService.getAllActiveAgents());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<AgentResponse> updateAgentRole(@PathVariable UUID id, @RequestParam AgentRole newRole) {
        return ResponseEntity.ok(agentService.updateAgentRole(id, newRole));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateAgent(@PathVariable UUID id) {
        agentService.deactivateAgent(id);
        return ResponseEntity.noContent().build();
    }

    // INTERNAL ENDPOINT — used by other microservices
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> agentExists(@PathVariable UUID id) {
        return ResponseEntity.ok(agentService.agentExists(id));
    }
}
