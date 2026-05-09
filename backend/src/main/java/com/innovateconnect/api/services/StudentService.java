package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentResumeRepository resumeRepository;

    public Student getStudentProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    @Transactional
    public Student updateStudentProfile(String email, Student studentUpdate) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setFullName(studentUpdate.getFullName());
        student.setGitHubLink(studentUpdate.getGitHubLink());
        student.setLeetCodeLink(studentUpdate.getLeetCodeLink());
        student.setUniversity(studentUpdate.getUniversity());
        student.setBio(studentUpdate.getBio());
        student.setSkills(studentUpdate.getSkills());
        student.setLocation(studentUpdate.getLocation());

        return studentRepository.save(student);
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Transactional
    public void uploadResume(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentResume resume = resumeRepository.findByStudentId(student.getId())
                .orElse(StudentResume.builder().student(student).build());

        resume.setResumeData(file.getBytes());
        resume.setResumeFileName(file.getOriginalFilename());
        resume.setResumeContentType(file.getContentType());
        resumeRepository.save(resume);
    }

    public StudentResume getResume(Integer studentId) {
        return resumeRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    @Transactional
    public void uploadCoverImage(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setCoverImageData(file.getBytes());
        student.setCoverImageType(file.getContentType());
        student.setHasCoverImage(true);
        studentRepository.save(student);
    }

    public Student getStudentWithCover(Integer id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getHasCoverImage() == null || !student.getHasCoverImage() || student.getCoverImageData() == null) {
            throw new RuntimeException("Cover image not found");
        }
        return student;
    }
}
