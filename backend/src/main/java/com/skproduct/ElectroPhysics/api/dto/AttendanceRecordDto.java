package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceRecordDto(
        Long id,
        Long studentUserId,
        String studentName,
        String grade,
        LocalDate attendanceDate,
        LocalDateTime checkInTime,
        String method,
        String status) {
}
