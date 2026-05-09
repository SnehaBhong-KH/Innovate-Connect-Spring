package com.innovateconnect.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // "Student" or "Company"

    // Student fields
    private String fullName;
    private String university;
    private String gitHubLink;
    private String leetCodeLink;

    // Company fields
    private String companyName;
    private String location;
    private String website;
}
