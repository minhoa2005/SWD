package com.jobseeker.controller;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.security.JwtUtil;
import com.jobseeker.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Application> applyJob(@Valid @RequestBody ApplicationDTO dto,
                                                 @RequestHeader("Authorization") String bearerToken) {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        Application application = applicationService.applyJob(dto, userId);
        return ResponseEntity.status(201).body(application);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(
            @RequestHeader("Authorization") String bearerToken) {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        return ResponseEntity.ok(applicationService.getMyApplications(userId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable String jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }
}
