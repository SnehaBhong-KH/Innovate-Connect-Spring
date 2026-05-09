package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Service
@Slf4j
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void apply(String email, Integer internshipId) {
        log.info("Application attempt by user: {} for internshipId: {}", email, internshipId);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not fully initialized. Please contact support."));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Application restricted to student accounts only."));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (applicationRepository.findByInternshipAndStudent(internship, student).isPresent()) {
            throw new RuntimeException("Already applied");
        }

        Application application = Application.builder()
                .internship(internship)
                .student(student)
                .status("Applied")
                .build();

        applicationRepository.save(application);

        // Notify Company
        if (internship.getCompany() != null && internship.getCompany().getUser() != null) {
            emailService.sendEmail(
                internship.getCompany().getUser().getEmail(),
                "New Application Received",
                "Student " + student.getFullName() + " has applied for " + internship.getTitle()
            );
        }
    }

    public List<Application> getStudentApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return applicationRepository.findByStudentId(student.getId());
    }

    public List<Application> getCompanyApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return applicationRepository.findByInternship_CompanyId(company.getId());
    }

    @Transactional
    public void updateStatus(Integer applicationId, String status) {
        status = status.replace("\"", ""); // Clean up JSON quotes
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        applicationRepository.save(application);

        // Notify student
        emailService.sendEmail(
                application.getStudent().getUser().getEmail(),
                "Internship Application Status Update",
                "Hi " + application.getStudent().getFullName() + ",\n\n" +
                        "Your application for " + application.getInternship().getTitle() +
                        " has been updated to: " + status + ".\n\n" +
                        "Best regards,\nInnovateConnect Team"
        );
    }
}
