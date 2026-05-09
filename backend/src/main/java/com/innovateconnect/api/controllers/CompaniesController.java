package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompaniesController {

    @Autowired
    private com.innovateconnect.api.services.CompanyService companyService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            return ResponseEntity.ok(companyService.getProfile(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Company companyUpdate) {
        try {
            return ResponseEntity.ok(companyService.updateProfile(authentication.getName(), companyUpdate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-cover")
    public ResponseEntity<?> uploadCoverImage(Authentication authentication, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            companyService.uploadCoverImage(authentication.getName(), file);
            return ResponseEntity.ok("Cover image uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading cover image: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/cover")
    public ResponseEntity<?> getCoverImage(@PathVariable Integer id) {
        try {
            Company company = companyService.getWithCover(id);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(company.getCoverImageType()))
                    .body(company.getCoverImageData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

