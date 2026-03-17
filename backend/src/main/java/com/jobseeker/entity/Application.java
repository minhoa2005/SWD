package com.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @Column(name = "application_id", length = 36)
    private String applicationId;

    @Column(name = "job_id", nullable = false, length = 36)
    private String jobId;

    @Column(name = "seeker_profile_id", nullable = false, length = 36)
    private String seekerProfileId;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "application_status", length = 30)
    @Builder.Default
    private String applicationStatus = "Applied";

    @Column(name = "cv_path")
    private String cvPath;

    @Column(name = "strategy_used", length = 50)
    private String strategyUsed;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    public void generateId() {
        if (this.applicationId == null) {
            this.applicationId = UUID.randomUUID().toString();
        }
    }
}
