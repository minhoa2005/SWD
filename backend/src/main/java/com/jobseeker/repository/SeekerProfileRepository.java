package com.jobseeker.repository;

import com.jobseeker.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, String> {
    Optional<SeekerProfile> findByUserId(String userId);
}
