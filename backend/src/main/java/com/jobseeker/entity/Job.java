package com.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @Column(name = "job_id", length = 36)
    private String jobId;

    @Column(name = "company_id", length = 36)
    private String companyId;

    @Column(name = "recruiter_profile_id", length = 36)
    private String recruiterProfileId;

    @Column(name = "job_title", nullable = false, length = 200)
    private String jobTitle;

    @Column(name = "job_desc", nullable = false, columnDefinition = "TEXT")
    private String jobDesc;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "experience_required")
    private Integer experienceRequired;

    @Column(name = "education_required", length = 100)
    private String educationRequired;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "work_mode", length = 50)
    private String workMode;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "job_location", length = 200)
    private String jobLocation;

    @Column(name = "job_status", length = 20)
    @Builder.Default
    private String jobStatus = "Active";

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "posted_at", updatable = false)
    private LocalDateTime postedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    public void generateId() {
        if (this.jobId == null) {
            this.jobId = UUID.randomUUID().toString();
        }
    }
}
