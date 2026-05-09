package com.innovateconnect.api.controllers;

import com.innovateconnect.api.models.ContactMessage;
import com.innovateconnect.api.repositories.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@Slf4j
public class ContactController {
    
    @Autowired
    private com.innovateconnect.api.services.ContactService contactService;
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitContactMessage(@RequestBody Map<String, String> payload) {
        log.info("Received contact message submission");
        
        try {
            contactService.submitMessage(payload);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Your message has been sent successfully. We'll get back to you soon!"
            ));
        } catch (Exception e) {
            log.error("Error saving contact message: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

