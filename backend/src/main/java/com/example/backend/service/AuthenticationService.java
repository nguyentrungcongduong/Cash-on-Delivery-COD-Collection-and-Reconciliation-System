package com.example.backend.service;

import com.example.backend.dto.AuthenticationResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationService(UserRepository repository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager) {
                this.repository = repository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
        }

        public AuthenticationResponse register(RegisterRequest request) {
                if (repository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                User user = new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setPhone(request.getPhone());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(request.getRole());

                repository.save(user);

                // Correct Flow: Register != Login. Do not return token.
                // Return null for tokens to indicate strictly that login is required.
                return new AuthenticationResponse(null, null, null);
        }

        public AuthenticationResponse authenticate(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();

                Map<String, Object> claims = new HashMap<>();
                claims.put("role", user.getRole().name());

                var jwtToken = jwtService.generateToken(claims, user);
                var refreshToken = jwtService.generateToken(claims, user);

                return new AuthenticationResponse(jwtToken, refreshToken, user);
        }
}
