package com.jobseeker.controller;

import com.jobseeker.dto.RecruiterProfileDTO;
import com.jobseeker.dto.SeekerProfileDTO;
import com.jobseeker.entity.RecruiterProfile;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.security.JwtUtil;
import com.jobseeker.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    private String extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }

    // ── Seeker endpoints ──────────────────────────

    @GetMapping("/seeker")
    public ResponseEntity<SeekerProfile> getSeekerProfile(
            @RequestHeader("Authorization") String auth) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.getSeekerProfile(userId));
    }

    @PutMapping("/seeker")
    public ResponseEntity<SeekerProfile> updateSeekerProfile(
            @RequestHeader("Authorization") String auth,
            @RequestBody SeekerProfileDTO dto) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.updateSeekerProfile(userId, dto));
    }

    // ── Recruiter endpoints ───────────────────────

    @GetMapping("/recruiter")
    public ResponseEntity<RecruiterProfile> getRecruiterProfile(
            @RequestHeader("Authorization") String auth) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.getRecruiterProfile(userId));
    }

    @PutMapping("/recruiter")
    public ResponseEntity<RecruiterProfile> updateRecruiterProfile(
            @RequestHeader("Authorization") String auth,
            @RequestBody RecruiterProfileDTO dto) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.updateRecruiterProfile(userId, dto));
    }
}
