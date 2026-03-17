package com.jobseeker.service;

import com.jobseeker.entity.Resume;
import com.jobseeker.entity.SeekerProfile;
import com.jobseeker.repository.ResumeRepository;
import com.jobseeker.repository.SeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final SeekerProfileRepository seekerProfileRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "docx");
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    @Transactional
    public Resume uploadResume(MultipartFile file, String userId) throws IOException {
        // Validate file exists
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file to upload.");
        }

        // Validate file size
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds 5MB limit.");
        }

        // Validate file format
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("Invalid file name.");
        }
        String extension = getExtension(originalName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Only PDF or DOCX files are allowed.");
        }

        // Resolve seeker profile
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Seeker profile not found"));

        // Delete old resume files/records for this seeker
        List<Resume> oldResumes = resumeRepository.findBySeekerProfileId(seeker.getSeekerProfileId());
        for (Resume old : oldResumes) {
            if (old.getFileUrl() != null) {
                try {
                    Files.deleteIfExists(Paths.get(old.getFileUrl()));
                } catch (IOException ignored) { /* best effort */ }
            }
        }
        resumeRepository.deleteBySeekerProfileId(seeker.getSeekerProfileId());

        // Save new file
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        String storedFileName = seeker.getSeekerProfileId() + "_" + System.currentTimeMillis() + "." + extension;
        Path targetPath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        Resume resume = Resume.builder()
                .seekerProfileId(seeker.getSeekerProfileId())
                .fileName(originalName)
                .fileFormat(extension.toUpperCase())
                .fileSize(file.getSize())
                .fileUrl(targetPath.toString())
                .isDefault(true)
                .build();

        return resumeRepository.save(resume);
    }

    public List<Resume> getMyResumes(String userId) {
        SeekerProfile seeker = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Seeker profile not found"));
        return resumeRepository.findBySeekerProfileId(seeker.getSeekerProfileId());
    }

    public Resume getResumeById(String resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found: " + resumeId));
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex + 1);
    }
}
