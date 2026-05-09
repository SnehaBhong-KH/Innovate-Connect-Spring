package com.innovateconnect.api.services;

import com.innovateconnect.api.dto.*;
import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import com.innovateconnect.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private EmailService emailService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String name = getDisplayName(user);

        return AuthResponse.builder()
                .token(jwt)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .name(name)
                        .build())
                .build();
    }

    private String getDisplayName(User user) {
        if ("Student".equalsIgnoreCase(user.getRole())) {
            return studentRepository.findByUserId(user.getId())
                    .map(Student::getFullName)
                    .orElse(user.getEmail().split("@")[0]);
        } else if ("Company".equalsIgnoreCase(user.getRole())) {
            return companyRepository.findByUserId(user.getId())
                    .map(Company::getCompanyName)
                    .orElse(user.getEmail().split("@")[0]);
        } else if ("Admin".equalsIgnoreCase(user.getRole())) {
            return "Administrator";
        }
        return user.getEmail().split("@")[0];
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        String displayName = "";
        if ("Student".equalsIgnoreCase(request.getRole())) {
            Student student = Student.builder()
                    .user(user)
                    .fullName(request.getFullName())
                    .university(request.getUniversity())
                    .gitHubLink(request.getGitHubLink())
                    .leetCodeLink(request.getLeetCodeLink())
                    .build();
            studentRepository.save(student);
            displayName = request.getFullName();
        } else if ("Company".equalsIgnoreCase(request.getRole())) {
            Company company = Company.builder()
                    .user(user)
                    .companyName(request.getCompanyName())
                    .location(request.getLocation())
                    .website(request.getWebsite())
                    .build();
            companyRepository.save(company);
            displayName = request.getCompanyName();
        }

        try {
            emailService.sendRegistrationEmail(request.getEmail(), displayName, request.getRole());
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
    }

    @Transactional
    public void registerStudent(StudentRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("Student")
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .fullName(request.getFullName())
                .university(request.getUniversity())
                .build();
        studentRepository.save(student);

        try {
            emailService.sendRegistrationEmail(request.getEmail(), request.getFullName(), "Student");
        } catch (Exception e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
    }

    @Transactional
    public void registerCompany(CompanyRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("Company")
                .build();
        user = userRepository.save(user);

        Company company = Company.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .location(request.getLocation())
                .build();
        companyRepository.save(company);

        try {
            emailService.sendRegistrationEmail(request.getEmail(), request.getCompanyName(), "Company");
        } catch (Exception e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
    }
}
