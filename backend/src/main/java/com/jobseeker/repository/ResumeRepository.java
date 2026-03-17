package com.jobseeker.repository;

import com.jobseeker.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, String> {
    List<Resume> findBySeekerProfileId(String seekerProfileId);
    Optional<Resume> findBySeekerProfileIdAndIsDefaultTrue(String seekerProfileId);

    @Modifying
    @Query("DELETE FROM Resume r WHERE r.seekerProfileId = :seekerProfileId")
    void deleteBySeekerProfileId(String seekerProfileId);
}
