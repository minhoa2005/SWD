package com.jobseeker.controller;

import com.jobseeker.dto.AuthResponse;
import com.jobseeker.dto.LoginDTO;
import com.jobseeker.dto.RegisterDTO;
import com.jobseeker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterDTO dto) {
        AuthResponse response = authService.register(dto);
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginDTO dto) {
        AuthResponse response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}
