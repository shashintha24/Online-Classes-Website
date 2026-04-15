package com.skproduct.ElectroPhysics.api.dto;

public record StudentAttendanceQrDto(
        Long studentUserId,
        String studentName,
        String grade,
        String qrCode,
        boolean markedToday,
        String todayStatus,
        String todayCheckInTime) {
}
