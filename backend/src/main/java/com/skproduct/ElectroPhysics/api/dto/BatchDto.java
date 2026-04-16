package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDateTime;

public record BatchDto(
        Long id,
        String name,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
