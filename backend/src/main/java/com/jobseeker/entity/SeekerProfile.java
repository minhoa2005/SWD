package com.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "seeker_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeekerProfile {

    @Id
    @Column(name = "seeker_profile_id", length = 36)
    private String seekerProfileId;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "current_location", length = 200)
    private String currentLocation;

    @Column(length = 255)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "job_preferences", columnDefinition = "TEXT")
    private String jobPreferences;

    @Column(name = "profile_completeness")
    @Builder.Default
    private Integer profileCompleteness = 0;

    @Column(name = "is_open_to_work")
    @Builder.Default
    private Boolean isOpenToWork = true;

    private Integer experience; // years

    @PrePersist
    public void generateId() {
        if (this.seekerProfileId == null) {
            this.seekerProfileId = UUID.randomUUID().toString();
        }
    }
}
