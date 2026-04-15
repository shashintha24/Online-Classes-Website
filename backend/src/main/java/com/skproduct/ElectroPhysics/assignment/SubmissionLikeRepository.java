package com.skproduct.ElectroPhysics.assignment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionLikeRepository extends JpaRepository<SubmissionLike, Long> {
    long countBySubmissionId(Long submissionId);

    boolean existsBySubmissionIdAndStudentUserId(Long submissionId, Long studentUserId);

    void deleteBySubmissionIdAndStudentUserId(Long submissionId, Long studentUserId);
}
