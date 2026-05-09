package com.innovateconnect.api.repositories;

import com.innovateconnect.api.models.Internship;
import com.innovateconnect.api.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Integer> {
    List<Internship> findByCompanyId(Integer companyId);
    List<Internship> findByCompany(Company company);
    List<Internship> findAllByOrderByPostedDateDesc();
    List<Internship> findByCompany_LocationOrderByPostedDateDesc(String location);
}
