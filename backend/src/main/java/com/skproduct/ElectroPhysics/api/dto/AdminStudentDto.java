package com.skproduct.ElectroPhysics.api.dto;

public record AdminStudentDto(
        Long userId,
        String username,
        String email,
        String fullName,
        String grade) {
}
