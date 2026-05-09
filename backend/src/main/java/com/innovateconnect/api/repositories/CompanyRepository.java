package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.Company;
import com.innovateconnect.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> findByUserId(Integer userId);
    Optional<Company> findByUser(User user);
}
