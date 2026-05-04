package com.nextstay.support.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "identity-service")
public interface IdentityServiceClient {

    @GetMapping("/api/agents/{agentId}/exists")
    Boolean agentExists(@PathVariable("agentId") UUID agentId);
}
