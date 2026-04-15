package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDateTime;

public record AssignmentSubmissionDetailDto(
        Long id,
        String studentName,
        Long studentUserId,
        LocalDateTime submittedAt,
        String fileName,
        String downloadUrl,
        String mark,
        boolean graded,
        long likeCount,
        boolean likedByCurrentUser) {
}
