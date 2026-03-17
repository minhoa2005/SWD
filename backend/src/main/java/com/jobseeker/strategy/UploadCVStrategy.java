package com.jobseeker.strategy;

import com.jobseeker.dto.ApplicationDTO;
import com.jobseeker.entity.Application;
import com.jobseeker.entity.Job;
import com.jobseeker.entity.Resume;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Strategy: Apply using a previously uploaded CV file.
 * Retrieves the seeker's resume record and uses the stored file URL.
 */
@Component("UPLOAD_CV")
@RequiredArgsConstructor
public class UploadCVStrategy implements ApplicationStrategy {

    private final ResumeRepository resumeRepository;

    @Override
    public Application apply(SeekerProfile seeker, Job job, ApplicationDTO dto) {
        Resume resume;
        if (dto.getResumeId() != null && !dto.getResumeId().isBlank()) {
            resume = resumeRepository.findById(dto.getResumeId())
                    .orElseThrow(() -> new IllegalArgumentException("Resume not found: " + dto.getResumeId()));
        } else {
            resume = resumeRepository.findBySeekerProfileIdAndIsDefaultTrue(seeker.getSeekerProfileId())
                    .orElseThrow(() -> new IllegalStateException("No CV found. Please upload your CV first."));
        }

        return Application.builder()
                .jobId(job.getJobId())
                .seekerProfileId(seeker.getSeekerProfileId())
                .coverLetter(dto.getCoverLetter())
                .cvPath(resume.getFileUrl())
                .applicationStatus("Applied")
                .strategyUsed("UPLOAD_CV")
                .build();
    }
}
