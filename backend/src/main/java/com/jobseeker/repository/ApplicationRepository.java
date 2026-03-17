package com.jobseeker.repository;

import com.jobseeker.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    Optional<Application> findByJobIdAndSeekerProfileId(String jobId, String seekerProfileId);
    List<Application> findAllBySeekerProfileId(String seekerProfileId);
    List<Application> findAllByJobId(String jobId);
}
