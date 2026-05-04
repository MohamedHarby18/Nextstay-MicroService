package com.nextstay.identity.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.UUID;

@FeignClient(name = "support-service")
public interface SupportServiceClient {

    @PutMapping("/api/tickets/agent/{agentId}/unassign")
    void unassignTicketsForAgent(@PathVariable("agentId") UUID agentId);
}
