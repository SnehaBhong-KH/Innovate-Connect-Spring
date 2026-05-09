package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.Application;
import com.innovateconnect.api.models.Student;
import com.innovateconnect.api.models.Internship;
import com.innovateconnect.api.models.User; // Added import for User
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    @EntityGraph(attributePaths = {"student", "student.resume", "internship"})
    List<Application> findByStudentId(Integer studentId);

    @EntityGraph(attributePaths = {"student", "student.resume"})
    List<Application> findByInternshipId(Integer internshipId);

    @EntityGraph(attributePaths = {"student", "student.resume", "internship"})
    List<Application> findByInternship_CompanyId(Integer companyId);
    Optional<Application> findByInternshipAndStudent(Internship internship, Student student);
}
