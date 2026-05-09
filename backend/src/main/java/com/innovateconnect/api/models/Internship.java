package com.innovateconnect.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "internships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Technology used is required")
    @Column(name = "technology_used", nullable = false)
    private String technologyUsed;

    @NotNull(message = "Stipend is required")
    @PositiveOrZero(message = "Stipend must be zero or positive")
    @Column(name = "stipend", precision = 18, scale = 2)
    private BigDecimal stipend;

    @Builder.Default
    @Column(name = "posted_date")
    private LocalDateTime postedDate = LocalDateTime.now();

    public String getCompanyName() {
        return company != null ? company.getCompanyName() : "Hidden";
    }

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<Application> applications;
}
