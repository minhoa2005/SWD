package com.jobseeker.service;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.entity.Job;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.repository.ApplicationRepository;
import com.jobseeker.repository.JobRepository;
import com.jobseeker.repository.SeekerProfileRepository;
import com.jobseeker.strategy.ApplicationStrategy;
import com.jobseeker.strategy.JobApplicationContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    // Spring injects the map keyed by @Component("UPLOAD_CV") and @Component("PROFILE")
    private final Map<String, ApplicationStrategy> strategyMap;

    @Transactional
    public Application applyJob(ApplicationDTO dto, String userId) {
        // Get seeker profile
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Seeker profile not found"));

        // Get job
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + dto.getJobId()));

        // Validate job is still active
        if (!Boolean.TRUE.equals(job.getIsActive())) {
            throw new IllegalStateException("This job is no longer accepting applications");
        }

        // Check existing application
        checkExistingApplication(seeker.getSeekerProfileId(), job.getJobId());

        // Check eligibility
        checkEligibility(seeker, job);

        // Select and execute strategy
        ApplicationStrategy strategy = selectStrategy(dto.getStrategyType());
        JobApplicationContext context = new JobApplicationContext(strategy);
        Application application = context.executeStrategy(seeker, job, dto);

        return applicationRepository.save(application);
    }

    public void checkExistingApplication(String seekerProfileId, String jobId) {
        applicationRepository.findByJobIdAndSeekerProfileId(jobId, seekerProfileId)
                .ifPresent(app -> {
                    throw new IllegalStateException("You have already applied for this position");
                });
    }

    public void checkEligibility(SeekerProfile seeker, Job job) {
        // Check experience requirement
        if (job.getExperienceRequired() != null && job.getExperienceRequired() > 0) {
            int seekerExp = seeker.getExperience() != null ? seeker.getExperience() : 0;
            if (seekerExp < job.getExperienceRequired()) {
                throw new IllegalStateException(
                    "You do not meet the experience requirement for this role. " +
                    "Required: " + job.getExperienceRequired() + " year(s), " +
                    "Your experience: " + seekerExp + " year(s)."
                );
            }
        }
        // Additional eligibility checks can be extended here
    }

    private ApplicationStrategy selectStrategy(String strategyType) {
        if (strategyType == null || strategyType.isBlank()) {
            strategyType = "UPLOAD_CV";
        }
        ApplicationStrategy strategy = strategyMap.get(strategyType.toUpperCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown strategy type: " + strategyType + ". Use 'UPLOAD_CV' or 'PROFILE'.");
        }
        return strategy;
    }

    public List<Application> getMyApplications(String userId) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Seeker profile not found"));
        return applicationRepository.findAllBySeekerProfileId(seeker.getSeekerProfileId());
    }

    public List<Application> getApplicationsForJob(String jobId) {
        return applicationRepository.findAllByJobId(jobId);
    }
}
