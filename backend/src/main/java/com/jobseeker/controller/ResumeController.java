package com.jobseeker.controller;

import com.jobseeker.entity.Resume;
import com.jobseeker.security.JwtUtil;
import com.jobseeker.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final JwtUtil jwtUtil;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String bearerToken) throws IOException {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        Resume resume = resumeService.uploadResume(file, userId);
        return ResponseEntity.status(201).body(Map.of(
                "message", "CV updated successfully.",
                "resumeId", resume.getResumeId(),
                "fileName", resume.getFileName(),
                "uploadDate", resume.getUploadDate().toString()
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Resume>> getMyResumes(
            @RequestHeader("Authorization") String bearerToken) {
        String userId = jwtUtil.extractUserId(bearerToken.substring(7));
        return ResponseEntity.ok(resumeService.getMyResumes(userId));
    }

    @GetMapping("/download/{resumeId}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String resumeId) {
        Resume resume = resumeService.getResumeById(resumeId);
        Resource resource = new FileSystemResource(Paths.get(resume.getFileUrl()));
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = resume.getFileFormat().equalsIgnoreCase("PDF")
                ? MediaType.APPLICATION_PDF
                : MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resume.getFileName() + "\"")
                .body(resource);
    }
}
