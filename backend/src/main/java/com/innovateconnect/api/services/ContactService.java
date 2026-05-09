package com.innovateconnect.api.services;

import com.innovateconnect.api.models.ContactMessage;
import com.innovateconnect.api.repositories.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Service
@Slf4j
public class ContactService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Transactional
    public void submitMessage(Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (message == null || message.trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        ContactMessage contactMessage = new ContactMessage(
            name.trim(),
            email.trim(),
            message.trim()
        );

        contactMessageRepository.save(contactMessage);
        log.info("Contact message saved successfully from: {}", email);
    }
}
