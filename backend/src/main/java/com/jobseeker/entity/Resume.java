package com.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @Column(name = "resume_id", length = 36)
    private String resumeId;

    @Column(name = "seeker_profile_id", nullable = false, length = 36)
    private String seekerProfileId;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_format", length = 10)
    private String fileFormat;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = true;

    @PrePersist
    public void generateId() {
        if (this.resumeId == null) {
            this.resumeId = UUID.randomUUID().toString();
        }
        if (this.uploadDate == null) {
            this.uploadDate = LocalDateTime.now();
        }
    }
}
