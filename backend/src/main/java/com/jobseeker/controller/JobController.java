package com.jobseeker.controller;

import com.jobseeker.dto.JobDTO;
import com.jobseeker.entity.Job;
import com.jobseeker.security.JwtUtil;
import com.jobseeker.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Job> postJob(@Valid @RequestBody JobDTO dto,
                                       @RequestHeader("Authorization") String bearerToken) {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        Job job = jobService.createJob(dto, userId);
        return ResponseEntity.status(201).body(job);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getActiveJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Job>> getMyJobs(@RequestHeader("Authorization") String bearerToken) {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        return ResponseEntity.ok(jobService.getJobsByRecruiter(userId));
    }
}
