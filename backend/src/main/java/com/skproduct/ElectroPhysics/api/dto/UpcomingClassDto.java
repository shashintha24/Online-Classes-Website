package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record UpcomingClassDto(
        Long scheduleId,
        String title,
        String subject,
        String batchName,
        String description,
        LocalDate classDate,
        LocalTime startTime,
        LocalTime endTime,
        boolean weeklyRecurring) {
}
