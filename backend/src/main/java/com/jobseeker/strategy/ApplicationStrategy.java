package com.jobseeker.strategy;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.entity.Job;
import com.jobseeker.entity.SeekerProfile;

/**
 * Strategy Pattern Interface for job application submission.
 */
public interface ApplicationStrategy {
    Application apply(SeekerProfile seeker, Job job, ApplicationDTO dto);
}
