package com.skproduct.ElectroPhysics.api.dto;

public record AdminStudentUpsertRequest(
        String username,
        String email,
        String password,
        String fullName,
        String grade) {
}
