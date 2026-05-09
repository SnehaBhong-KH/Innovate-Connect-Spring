package com.innovateconnect.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/external")
public class ExternalController {

    @Autowired
    private com.innovateconnect.api.services.ExternalService externalService;

    @GetMapping("/leetcode/{username}")
    public ResponseEntity<?> getLeetCodeStats(@PathVariable String username) {
        try {
            return ResponseEntity.ok(externalService.getLeetCodeStats(username));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching LeetCode stats");
        }
    }

    @GetMapping("/github/{username}")
    public ResponseEntity<?> getGitHubLanguages(@PathVariable String username) {
        try {
            return ResponseEntity.ok(externalService.getGitHubRepos(username));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching GitHub repos");
        }
    }
}

