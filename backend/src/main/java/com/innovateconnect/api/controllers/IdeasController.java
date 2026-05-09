package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.Idea;
import com.innovateconnect.api.models.Student;
import com.innovateconnect.api.models.User;
import com.innovateconnect.api.repositories.IdeaRepository;
import com.innovateconnect.api.repositories.StudentRepository;
import com.innovateconnect.api.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
public class IdeasController {

    @Autowired
    private com.innovateconnect.api.services.IdeaService ideaService;

    @GetMapping
    public ResponseEntity<?> getAllIdeas() {
        return ResponseEntity.ok(ideaService.getAllIdeas());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyIdeas(Authentication authentication) {
        try {
            return ResponseEntity.ok(ideaService.getMyIdeas(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> postIdea(Authentication authentication, @Valid @RequestBody Idea idea) {
        try {
            return ResponseEntity.ok(ideaService.shareIdea(authentication.getName(), idea));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIdea(Authentication authentication, @PathVariable Integer id) {
        try {
            ideaService.deleteIdea(authentication.getName(), id);
            return ResponseEntity.ok("Idea deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}

