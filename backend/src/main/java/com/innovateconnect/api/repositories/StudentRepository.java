package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.Student;
import com.innovateconnect.api.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    @EntityGraph(attributePaths = {"resume"})
    Optional<Student> findByUserId(Integer userId);

    @EntityGraph(attributePaths = {"resume"})
    Optional<Student> findByUser(User user);
}
