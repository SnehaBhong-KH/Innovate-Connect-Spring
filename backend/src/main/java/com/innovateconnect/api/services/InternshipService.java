package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<Internship> getAllInternships() {
        return internshipRepository.findAllByOrderByPostedDateDesc();
    }

    public List<Internship> getMyInternships(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return internshipRepository.findByCompany(company);
    }

    @Transactional
    public Internship createInternship(String email, Internship internship) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        internship.setCompany(company);
        return internshipRepository.save(internship);
    }

    public List<Application> getApplicants(Integer internshipId) {
        return applicationRepository.findByInternshipId(internshipId);
    }

    public List<Internship> getRecommendedInternships(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        String location = student.getLocation();
        if (location == null || location.isEmpty()) {
            return List.of(); // No recommendations if no location set
        }
        
        return internshipRepository.findByCompany_LocationOrderByPostedDateDesc(location);
    }
}
