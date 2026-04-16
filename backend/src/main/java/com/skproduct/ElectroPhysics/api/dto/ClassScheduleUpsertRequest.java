package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ClassScheduleUpsertRequest(
        String title,
        String subject,
        String batchName,
        String description,
        LocalDate startDate,
        LocalTime startTime,
        LocalTime endTime,
        Boolean weeklyRecurring,
        LocalDate recurrenceEndDate) {
}
