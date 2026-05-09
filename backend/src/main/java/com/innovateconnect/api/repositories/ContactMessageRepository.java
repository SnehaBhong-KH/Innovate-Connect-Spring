package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Integer> {
    
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    
    long countByStatus(String status);
}
