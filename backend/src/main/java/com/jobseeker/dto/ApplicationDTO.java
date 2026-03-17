package com.jobseeker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationDTO {

    @NotBlank(message = "Job ID is required")
    private String jobId;

    private String resumeId;

    private String coverLetter;

    // UPLOAD_CV or PROFILE
    @NotBlank(message = "Strategy type is required")
    private String strategyType;
}
