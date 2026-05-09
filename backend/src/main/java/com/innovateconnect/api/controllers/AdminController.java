package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.User;
import com.innovateconnect.api.models.ContactMessage;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@Slf4j
public class AdminController {

    @Autowired
    private com.innovateconnect.api.services.AdminService adminService;

    @GetMapping("/version")
    public ResponseEntity<String> getVersion() {
        return ResponseEntity.ok("DEEP_DELETE_FIX_V2_SERVICE_LAYER");
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        log.info("Admin fetching statistics...");
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        log.info("Admin fetching all users list...");
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Admin [{}] attempting delete for user ID: {}", auth.getName(), id);

        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting user {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/ideas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllIdeas() {
        log.info("Admin fetching all ideas list...");
        return ResponseEntity.ok(adminService.getAllIdeas());
    }

    @DeleteMapping("/ideas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteIdea(@PathVariable Integer id) {
        log.info("Admin deleting idea ID: {}", id);
        adminService.deleteIdea(id);
        return ResponseEntity.ok("Idea deleted");
    }

    @GetMapping("/internships")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllInternships() {
        log.info("Admin fetching all internships list...");
        return ResponseEntity.ok(adminService.getAllInternships());
    }

    @DeleteMapping("/internships/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteInternship(@PathVariable Integer id) {
        log.info("Admin deleting internship ID: {}", id);
        adminService.deleteInternship(id);
        return ResponseEntity.ok("Internship deleted");
    }

    // Contact Message Management
    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllMessages() {
        log.info("Admin fetching all contact messages...");
        return ResponseEntity.ok(adminService.getAllMessages());
    }

    @PutMapping("/messages/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMessageStatus(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        log.info("Admin updating message ID: {} status", id);
        try {
            adminService.updateMessageStatus(id, payload.get("status"));
            return ResponseEntity.ok("Message status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable Integer id) {
        log.info("Admin deleting message ID: {}", id);
        adminService.deleteMessage(id);
        return ResponseEntity.ok("Message deleted");
    }
}


