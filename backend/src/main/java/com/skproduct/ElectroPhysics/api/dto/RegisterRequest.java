package com.skproduct.ElectroPhysics.api.dto;

public record RegisterRequest(
        String username,
        String email,
        String password,
        String fullName,
        String role,
        String grade,
        String subject) {
}
