package com.skproduct.ElectroPhysics.api.dto;

import java.time.LocalDateTime;

public record NotificationDto(
        Long id,
        String title,
        String body,
        String type,
        boolean unread,
        LocalDateTime createdAt) {
}
