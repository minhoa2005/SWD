package com.jobseeker.service;

import com.jobseeker.dto.AuthResponse;
import com.jobseeker.dto.LoginDTO;
import com.jobseeker.dto.RegisterDTO;
import com.jobseeker.entity.RecruiterProfile;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.entity.User;
import com.jobseeker.repository.RecruiterProfileRepository;
import com.jobseeker.repository.SeekerProfileRepository;
import com.jobseeker.repository.UserRepository;
import com.jobseeker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    @Transactional
    public AuthResponse register(RegisterDTO dto) {
        // Validate passwords match
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check username/email uniqueness
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Create user
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .status("ACTIVE")
                .accountStatus("ACTIVE")
                .build();
        user = userRepository.save(user);

        // Create profile based on role
        if ("SEEKER".equals(dto.getRole())) {
            SeekerProfile profile = SeekerProfile.builder()
                    .userId(user.getUserId())
                    .fullName(dto.getFullName() != null ? dto.getFullName() : dto.getUsername())
                    .phoneNumber(dto.getPhone())
                    .build();
            var savedProfile = seekerProfileRepository.save(profile);
            return AuthResponse.builder()
                    .message("Registered successfully")
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .role(user.getRole())
                    .profileId(savedProfile.getSeekerProfileId())
                    .build();
        } else if ("RECRUITER".equals(dto.getRole())) {
            RecruiterProfile profile = RecruiterProfile.builder()
                    .userId(user.getUserId())
                    .positionTitle(dto.getPositionTitle())
                    .contactPhone(dto.getPhone())
                    .build();
            var savedProfile = recruiterProfileRepository.save(profile);
            return AuthResponse.builder()
                    .message("Registered successfully")
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .role(user.getRole())
                    .profileId(savedProfile.getRecruiterProfileId())
                    .build();
        }

        return AuthResponse.builder().message("Registered successfully").userId(user.getUserId()).build();
    }

    @Transactional
    public AuthResponse login(LoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // Check if account is locked
        if (user.getLockedUntil() != null && LocalDateTime.now().isBefore(user.getLockedUntil())) {
            long minutesLeft = java.time.Duration.between(LocalDateTime.now(), user.getLockedUntil()).toMinutes() + 1;
            throw new IllegalStateException("Account is locked. Try again in " + minutesLeft + " minute(s).");
        }

        // Check if account is deleted/suspended
        if (!"ACTIVE".equals(user.getAccountStatus())) {
            throw new IllegalStateException("Account is suspended or inactive.");
        }

        // Verify password
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            handleFailedAttempt(user);
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Successful login – reset failed attempts
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        // Resolve profile ID
        String profileId = null;
        if ("SEEKER".equals(user.getRole())) {
            profileId = seekerProfileRepository.findByUserId(user.getUserId())
                    .map(SeekerProfile::getSeekerProfileId).orElse(null);
        } else if ("RECRUITER".equals(user.getRole())) {
            profileId = recruiterProfileRepository.findByUserId(user.getUserId())
                    .map(RecruiterProfile::getRecruiterProfileId).orElse(null);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getUserId());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getUserId())
                .username(user.getUsername())
                .profileId(profileId)
                .message("Login successful")
                .build();
    }

    private void handleFailedAttempt(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            user.setAccountStatus("LOCKED");
        }
        userRepository.save(user);
    }
}
