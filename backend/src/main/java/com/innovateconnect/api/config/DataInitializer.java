package com.innovateconnect.api.config;

import com.innovateconnect.api.models.User;
import com.innovateconnect.api.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepository.findByEmail("admin@innovate.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@innovate.com")
                    .passwordHash(passwordEncoder.encode("Admin@02"))
                    .role("Admin")
                    .build();
            userRepository.save(admin);
        }
    }
}
