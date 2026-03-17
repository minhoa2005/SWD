package com.jobseeker.service;

import com.jobseeker.dto.RecruiterProfileDTO;
import com.jobseeker.dto.SeekerProfileDTO;
import com.jobseeker.entity.RecruiterProfile;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.repository.RecruiterProfileRepository;
import com.jobseeker.repository.SeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final SeekerProfileRepository seekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    // ── Seeker ──────────────────────────────────

    public SeekerProfile getSeekerProfile(String userId) {
        return seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Seeker profile not found"));
    }

    @Transactional
    public SeekerProfile updateSeekerProfile(String userId, SeekerProfileDTO dto) {
        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Seeker profile not found"));

        if (dto.getFullName() != null)      profile.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null)   profile.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getCurrentLocation() != null) profile.setCurrentLocation(dto.getCurrentLocation());
        if (dto.getHeadline() != null)      profile.setHeadline(dto.getHeadline());
        if (dto.getEducation() != null)     profile.setEducation(dto.getEducation());
        if (dto.getSkills() != null)        profile.setSkills(dto.getSkills());
        if (dto.getJobPreferences() != null) profile.setJobPreferences(dto.getJobPreferences());
        if (dto.getExperience() != null)    profile.setExperience(dto.getExperience());
        if (dto.getIsOpenToWork() != null)  profile.setIsOpenToWork(dto.getIsOpenToWork());
        if (dto.getDateOfBirth() != null)   profile.setDateOfBirth(dto.getDateOfBirth());

        // Recalculate completeness
        profile.setProfileCompleteness(calculateSeekerCompleteness(profile));

        return seekerProfileRepository.save(profile);
    }

    private int calculateSeekerCompleteness(SeekerProfile p) {
        int score = 0;
        if (notEmpty(p.getFullName()))         score += 15;
        if (notEmpty(p.getPhoneNumber()))      score += 10;
        if (notEmpty(p.getHeadline()))         score += 15;
        if (notEmpty(p.getSkills()))           score += 20;
        if (notEmpty(p.getEducation()))        score += 15;
        if (notEmpty(p.getCurrentLocation()))  score += 10;
        if (p.getExperience() != null)         score += 15;
        return Math.min(score, 100);
    }

    private boolean notEmpty(String s) { return s != null && !s.isBlank(); }

    // ── Recruiter ────────────────────────────────

    public RecruiterProfile getRecruiterProfile(String userId) {
        return recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));
    }

    @Transactional
    public RecruiterProfile updateRecruiterProfile(String userId, RecruiterProfileDTO dto) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        if (dto.getPositionTitle() != null)   profile.setPositionTitle(dto.getPositionTitle());
        if (dto.getDepartment() != null)      profile.setDepartment(dto.getDepartment());
        if (dto.getContactPhone() != null)    profile.setContactPhone(dto.getContactPhone());
        if (dto.getBio() != null)             profile.setBio(dto.getBio());
        if (dto.getIsPrimaryContact() != null) profile.setIsPrimaryContact(dto.getIsPrimaryContact());

        return recruiterProfileRepository.save(profile);
    }
}
