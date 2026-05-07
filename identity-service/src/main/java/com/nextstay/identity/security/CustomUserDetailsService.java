package com.nextstay.identity.security;

import com.nextstay.identity.entity.Agent;
import com.nextstay.identity.entity.User;
import com.nextstay.identity.repository.AgentRepository;
import com.nextstay.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AgentRepository agentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try finding as User first
        Optional<User> userOpt = userRepository.findByEmail(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        }

        // Try finding as Agent
        Optional<Agent> agentOpt = agentRepository.findByEmail(username);
        if (agentOpt.isPresent()) {
            Agent agent = agentOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    agent.getEmail(),
                    agent.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + agent.getRole().name()))
            );
        }

        throw new UsernameNotFoundException("User Not Found with email: " + username);
    }
}
