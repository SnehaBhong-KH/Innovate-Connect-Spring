package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentsController {

    @Autowired
    private com.innovateconnect.api.services.StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            return ResponseEntity.ok(studentService.getStudentProfile(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Student studentUpdate) {
        try {
            return ResponseEntity.ok(studentService.updateStudentProfile(authentication.getName(), studentUpdate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(studentService.getStudentById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(Authentication authentication, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            studentService.uploadResume(authentication.getName(), file);
            return ResponseEntity.ok("Resume uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading resume: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<?> getResume(@PathVariable Integer id) {
        try {
            StudentResume resume = studentService.getResume(id);
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getResumeFileName() + "\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType(resume.getResumeContentType()))
                    .body(resume.getResumeData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload-cover")
    public ResponseEntity<?> uploadCoverImage(Authentication authentication, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            studentService.uploadCoverImage(authentication.getName(), file);
            return ResponseEntity.ok("Cover image uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading cover image: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/cover")
    public ResponseEntity<?> getCoverImage(@PathVariable Integer id) {
        try {
            Student student = studentService.getStudentWithCover(id);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(student.getCoverImageType()))
                    .body(student.getCoverImageData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

