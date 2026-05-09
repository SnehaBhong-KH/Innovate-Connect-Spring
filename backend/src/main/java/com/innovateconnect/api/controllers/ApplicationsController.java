package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import com.innovateconnect.api.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@lombok.extern.slf4j.Slf4j
public class ApplicationsController {

    @Autowired
    private com.innovateconnect.api.services.ApplicationService applicationService;

    @PostMapping("/{internshipId}")
    public ResponseEntity<?> apply(Authentication authentication, @PathVariable Integer internshipId) {
        try {
            applicationService.apply(authentication.getName(), internshipId);
            return ResponseEntity.ok("Application submitted successfully");
        } catch (Exception e) {
            log.error("Error applying: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        try {
            return ResponseEntity.ok(applicationService.getStudentApplications(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/company")
    public ResponseEntity<?> getCompanyApplications(Authentication authentication) {
        try {
            return ResponseEntity.ok(applicationService.getCompanyApplications(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody String status) {
        try {
            applicationService.updateStatus(id, status);
            return ResponseEntity.ok("Application status updated to " + status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

