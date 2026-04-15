package com.skproduct.ElectroPhysics.assignment;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "submission_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"submission_id", "student_user_id"})
})
public class SubmissionLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private AssignmentSubmission submission;

    @Column(nullable = false)
    private Long studentUserId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @SuppressWarnings("unused")
    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public AssignmentSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(AssignmentSubmission submission) {
        this.submission = submission;
    }

    public Long getStudentUserId() {
        return studentUserId;
    }

    public void setStudentUserId(Long studentUserId) {
        this.studentUserId = studentUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
