package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IdeaService {

    @Autowired
    private IdeaRepository ideaRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Idea> getAllIdeas() {
        return ideaRepository.findAll();
    }

    public List<Idea> getMyIdeas(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ideaRepository.findByStudent(student);
    }

    @Transactional
    public Idea shareIdea(String email, Idea idea) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        idea.setStudent(student);
        return ideaRepository.save(idea);
    }

    @Transactional
    public void deleteIdea(String email, Integer id) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));
        
        // Safety check: Ensure student owns the idea
        if (!idea.getStudent().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this idea");
        }
        
        ideaRepository.delete(idea);
    }
}
