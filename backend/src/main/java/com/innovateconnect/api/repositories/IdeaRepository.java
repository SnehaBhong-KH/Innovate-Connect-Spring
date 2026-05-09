package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.Idea;
import com.innovateconnect.api.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IdeaRepository extends JpaRepository<Idea, Integer> {
    List<Idea> findByStudentId(Integer studentId);
    List<Idea> findByStudent(Student student);
}
