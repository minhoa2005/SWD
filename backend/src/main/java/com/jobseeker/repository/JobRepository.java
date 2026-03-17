package com.jobseeker.repository;

import com.jobseeker.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findAllByJobStatusAndIsActiveTrue(String jobStatus);
    List<Job> findAllByIsActiveTrue();
    List<Job> findAllByRecruiterProfileId(String recruiterProfileId);
}
