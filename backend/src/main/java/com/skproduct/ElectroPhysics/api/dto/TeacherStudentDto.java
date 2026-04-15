package com.skproduct.ElectroPhysics.api.dto;

public record TeacherStudentDto(
        Long userId,
        String username,
        String fullName,
        String grade) {
}
