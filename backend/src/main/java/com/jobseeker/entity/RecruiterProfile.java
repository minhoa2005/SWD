package com.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recruiter_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfile {

    @Id
    @Column(name = "recruiter_profile_id", length = 36)
    private String recruiterProfileId;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "company_id", length = 36)
    private String companyId;

    @Column(name = "position_title", length = 100)
    private String positionTitle;

    @Column(length = 100)
    private String department;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_primary_contact")
    @Builder.Default
    private Boolean isPrimaryContact = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    public void generateId() {
        if (this.recruiterProfileId == null) {
            this.recruiterProfileId = UUID.randomUUID().toString();
        }
    }
}
