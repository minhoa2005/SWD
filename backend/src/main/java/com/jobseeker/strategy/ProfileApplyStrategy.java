package com.jobseeker.strategy;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.entity.Job;
import com.jobseeker.entity.SeekerProfile;
import org.springframework.stereotype.Component;

/**
 * Strategy: Apply using the seeker's stored profile (skills, education, experience).
 * No file attachment – relies on the profile data itself.
 */
@Component("PROFILE")
public class ProfileApplyStrategy implements ApplicationStrategy {

    @Override
    public Application apply(SeekerProfile seeker, Job job, ApplicationDTO dto) {
        return Application.builder()
                .jobId(job.getJobId())
                .seekerProfileId(seeker.getSeekerProfileId())
                .coverLetter(dto.getCoverLetter())
                .cvPath(null) // profile-based, no file path needed
                .applicationStatus("Applied")
                .strategyUsed("PROFILE")
                .build();
    }
}
