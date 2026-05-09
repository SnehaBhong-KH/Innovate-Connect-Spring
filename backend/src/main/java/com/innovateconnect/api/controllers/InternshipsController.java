package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.Internship;
import com.innovateconnect.api.models.Company;
import com.innovateconnect.api.models.User;
import com.innovateconnect.api.repositories.InternshipRepository;
import com.innovateconnect.api.repositories.CompanyRepository;
import com.innovateconnect.api.repositories.UserRepository;
import com.innovateconnect.api.repositories.ApplicationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipsController {

    @Autowired
    private com.innovateconnect.api.services.InternshipService internshipService;

    @GetMapping
    public ResponseEntity<?> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/my-internships")
    public ResponseEntity<?> getMyInternships(Authentication authentication) {
        try {
            return ResponseEntity.ok(internshipService.getMyInternships(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> postInternship(Authentication authentication, @Valid @RequestBody Internship internship) {
        try {
            return ResponseEntity.ok(internshipService.createInternship(authentication.getName(), internship));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/applicants")
    public ResponseEntity<?> getApplicants(@PathVariable Integer id) {
        return ResponseEntity.ok(internshipService.getApplicants(id));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(Authentication authentication) {
        return ResponseEntity.ok(internshipService.getRecommendedInternships(authentication.getName()));
    }
}

