package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDateTime;

public record AssignmentSubmissionDto(
        Long id,
        String studentName,
        Long studentUserId,
        LocalDateTime submittedAt,
        String fileName,
        String downloadUrl,
        String mark,
        boolean graded) {
}