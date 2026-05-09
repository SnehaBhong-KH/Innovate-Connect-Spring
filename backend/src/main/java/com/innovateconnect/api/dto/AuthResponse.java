package com.innovateconnect.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private Integer id;
        private String email;
        private String role;
        private String name;
    }
}
