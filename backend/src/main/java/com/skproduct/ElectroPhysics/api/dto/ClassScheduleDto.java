package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ClassScheduleDto(
        Long id,
        String title,
        String subject,
        String batchName,
        String description,
        LocalDate startDate,
        LocalTime startTime,
        LocalTime endTime,
        boolean weeklyRecurring,
        LocalDate recurrenceEndDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
