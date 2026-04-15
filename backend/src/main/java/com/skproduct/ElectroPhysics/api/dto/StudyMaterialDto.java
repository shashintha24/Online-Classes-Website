package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDateTime;

public record StudyMaterialDto(
        Long id,
        String title,
        String materialType,
        String batchName,
        String description,
        String originalFileName,
        Long sizeBytes,
        String mimeType,
        String externalUrl,
        String actionUrl,
        boolean external,
        LocalDateTime createdAt) {
}
