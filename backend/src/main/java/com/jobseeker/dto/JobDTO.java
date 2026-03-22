package com.jobseeker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobDTO {

    @NotBlank(message = "Job title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    private String jobDesc;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    @NotBlank(message = "Work mode is required")
    private String workMode;

    @NotBlank(message = "Location is required")
    private String jobLocation;

    @NotNull(message = "Minimum salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be strictly greater than 0")
    private BigDecimal salaryMin;

    @NotNull(message = "Maximum salary is required")
    private BigDecimal salaryMax;

    @NotNull(message = "Expiration date is required")
    private LocalDateTime expiresAt;

    private String requiredSkills;
    private Integer experienceRequired;
    private String educationRequired;
}
