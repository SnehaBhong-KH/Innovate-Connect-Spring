package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private IdeaRepository ideaRepository;
    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalIdeas", ideaRepository.count());
        stats.put("activeInternships", internshipRepository.count());
        stats.put("pendingMessages", contactMessageRepository.countByStatus("PENDING"));
        return stats;
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("createdAt", u.getCreatedAt());

            String name = u.getEmail() != null ? u.getEmail().split("@")[0] : "User";
            String role = u.getRole() != null ? u.getRole().trim() : "";
            
            if ("Student".equalsIgnoreCase(role)) {
                name = studentRepository.findByUserId(u.getId()).map(Student::getFullName).orElse(name);
            } else if ("Company".equalsIgnoreCase(role)) {
                name = companyRepository.findByUserId(u.getId()).map(Company::getCompanyName).orElse(name);
            }
            map.put("profileName", name);
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if ("Admin".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Cannot delete Admin");
        }

        // Explicitly handle Student children
        studentRepository.findByUserId(id).ifPresent(student -> {
            log.info("Explicitly cleaning up Student [{}] applications and ideas...", student.getId());
            applicationRepository.deleteAll(applicationRepository.findByStudentId(student.getId()));
            ideaRepository.deleteAll(ideaRepository.findByStudent(student));
            applicationRepository.flush(); 
            ideaRepository.flush();
        });

        // Explicitly handle Company children
        companyRepository.findByUserId(id).ifPresent(company -> {
            log.info("Explicitly cleaning up Company [{}] internships and their applications...", company.getId());
            internshipRepository.findByCompany(company).forEach(internship -> {
                applicationRepository.deleteAll(applicationRepository.findByInternshipId(internship.getId()));
            });
            applicationRepository.flush();
            internshipRepository.deleteAll(internshipRepository.findByCompany(company));
            internshipRepository.flush();
        });

        userRepository.delete(user);
        userRepository.flush(); 
    }

    public List<Map<String, Object>> getAllIdeas() {
        return ideaRepository.findAll().stream().map(idea -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", idea.getId());
            map.put("title", idea.getTitle());
            map.put("technologyUsed", idea.getTechnologyUsed());
            map.put("postedDate", idea.getPostedDate());
            map.put("studentName", idea.getStudentName());
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllInternships() {
        return internshipRepository.findAll().stream().map(intern -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", intern.getId());
            map.put("title", intern.getTitle());
            map.put("companyName", intern.getCompanyName());
            map.put("stipend", intern.getStipend());
            map.put("postedDate", intern.getPostedDate());
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream().map(msg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", msg.getId());
            map.put("name", msg.getName());
            map.put("email", msg.getEmail());
            map.put("message", msg.getMessage());
            map.put("status", msg.getStatus());
            map.put("createdAt", msg.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateMessageStatus(Integer id, String newStatus) {
        contactMessageRepository.findById(id).ifPresent(msg -> {
            if (newStatus != null && (newStatus.equals("PENDING") || newStatus.equals("REVIEWED"))) {
                msg.setStatus(newStatus);
                contactMessageRepository.save(msg);
            } else {
                throw new RuntimeException("Invalid status");
            }
        });
    }

    @Transactional
    public void deleteIdea(Integer id) {
        ideaRepository.deleteById(id);
    }

    @Transactional
    public void deleteInternship(Integer id) {
        internshipRepository.deleteById(id);
    }

    @Transactional
    public void deleteMessage(Integer id) {
        contactMessageRepository.deleteById(id);
    }
}
