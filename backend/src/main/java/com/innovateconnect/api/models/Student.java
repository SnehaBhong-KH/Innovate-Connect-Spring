package com.innovateconnect.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "github_link")
    private String gitHubLink;

    @Column(name = "leetcode_link")
    private String leetCodeLink;

    @Column(name = "university")
    private String university;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "location")
    private String location;
    
    @Column(name = "skills")
    private String skills;

    @Lob
    @Column(name = "cover_image_data", columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] coverImageData;

    @Column(name = "cover_image_type")
    @JsonIgnore
    private String coverImageType;

    @Builder.Default
    @Column(name = "has_cover_image")
    private Boolean hasCoverImage = false;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private StudentResume resume;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<Idea> ideas;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<Application> applications;

    public String getResumeFileName() {
        return resume != null ? resume.getResumeFileName() : null;
    }
}
