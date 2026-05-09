package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.StudentResume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentResumeRepository extends JpaRepository<StudentResume, Integer> {
    Optional<StudentResume> findByStudentId(Integer studentId);
}
