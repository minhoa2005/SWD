package com.jobseeker.service;

import com.jobseeker.dto.JobDTO;
import com.jobseeker.entity.Job;
import com.jobseeker.repository.JobRepository;
import com.jobseeker.repository.RecruiterProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    @Transactional
    public Job createJob(JobDTO dto, String userId) {
        // Validate salary range
        if (dto.getSalaryMin() != null && dto.getSalaryMax() != null
                && dto.getSalaryMin().compareTo(dto.getSalaryMax()) > 0) {
            throw new IllegalArgumentException("Salary minimum cannot exceed salary maximum");
        }

        // Validate expiration date
        if (dto.getExpiresAt() != null && dto.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Expiration date must be in the future");
        }

        // Resolve recruiter profile id from userId
        var recruiterProfile = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Recruiter profile not found"));

        Job job = Job.builder()
                .recruiterProfileId(recruiterProfile.getRecruiterProfileId())
                .companyId(recruiterProfile.getCompanyId())
                .jobTitle(dto.getJobTitle())
                .jobDesc(dto.getJobDesc())
                .employmentType(dto.getEmploymentType())
                .workMode(dto.getWorkMode())
                .jobLocation(dto.getJobLocation())
                .salaryMin(dto.getSalaryMin())
                .salaryMax(dto.getSalaryMax())
                .expiresAt(dto.getExpiresAt())
                .requiredSkills(dto.getRequiredSkills())
                .experienceRequired(dto.getExperienceRequired())
                .educationRequired(dto.getEducationRequired())
                .jobStatus("Active")
                .isActive(true)
                .build();

        return jobRepository.save(job);
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findAllByIsActiveTrue();
    }

    public Job getJobById(String jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
    }

    public List<Job> getJobsByRecruiter(String userId) {
        var recruiterProfile = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Recruiter profile not found"));
        return jobRepository.findAllByRecruiterProfileId(recruiterProfile.getRecruiterProfileId());
    }
}
