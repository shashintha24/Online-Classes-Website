package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AssignmentSummaryDto(
        Long id,
        String title,
        String subject,
        String description,
        LocalDate dueDate,
        int totalStudents,
        long submittedCount,
        long gradedCount,
        String status,
        String attachmentName,
        String attachmentUrl,
        boolean hasAttachment,
        LocalDateTime createdAt) {
}