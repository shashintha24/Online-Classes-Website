package com.skproduct.ElectroPhysics.assignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentIdOrderBySubmittedAtDesc(Long assignmentId);

    List<AssignmentSubmission> findByAssignmentIdAndStudentUserIdOrderBySubmittedAtDesc(Long assignmentId, Long studentUserId);

    long countByAssignmentId(Long assignmentId);

    long countByAssignmentIdAndGradedTrue(Long assignmentId);
}