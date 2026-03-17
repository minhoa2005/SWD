package com.jobseeker.repository;

import com.jobseeker.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, String> {
    Optional<RecruiterProfile> findByUserId(String userId);
}
