package com.jobseeker.strategy;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.entity.Job;
import com.jobseeker.entity.SeekerProfile;

/**
 * Context class for the Strategy Pattern.
 * Holds a reference to the current ApplicationStrategy and delegates execution.
 */
public class JobApplicationContext {

    private ApplicationStrategy strategy;

    public JobApplicationContext(ApplicationStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(ApplicationStrategy strategy) {
        this.strategy = strategy;
    }

    public Application executeStrategy(SeekerProfile seeker, Job job, ApplicationDTO dto) {
        if (strategy == null) {
            throw new IllegalStateException("No application strategy set");
        }
        return strategy.apply(seeker, job, dto);
    }
}
