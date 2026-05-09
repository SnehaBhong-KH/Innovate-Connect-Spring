package com.innovateconnect.api.services;

import com.innovateconnect.api.models.*;
import com.innovateconnect.api.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    public Company getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));
    }

    @Transactional
    public Company updateProfile(String email, Company companyUpdate) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCompanyName(companyUpdate.getCompanyName());
        company.setLocation(companyUpdate.getLocation());
        company.setWebsite(companyUpdate.getWebsite());

        return companyRepository.save(company);
    }

    @Transactional
    public void uploadCoverImage(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCoverImageData(file.getBytes());
        company.setCoverImageType(file.getContentType());
        company.setHasCoverImage(true);
        companyRepository.save(company);
    }

    public Company getWithCover(Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (company.getHasCoverImage() == null || !company.getHasCoverImage() || company.getCoverImageData() == null) {
            throw new RuntimeException("Cover image not found");
        }
        return company;
    }
}
