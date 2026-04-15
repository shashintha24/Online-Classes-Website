package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;

public record AssignmentUpsertRequest(
        String title,
        String subject,
        String description,
        LocalDate dueDate,
        Integer totalStudents,
        String status) {
}