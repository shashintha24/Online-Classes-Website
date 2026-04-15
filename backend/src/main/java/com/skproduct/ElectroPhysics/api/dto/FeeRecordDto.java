package com.skproduct.ElectroPhysics.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FeeRecordDto(
        Long id,
        Long studentUserId,
        String studentName,
        String grade,
        String feeMonth,
        BigDecimal amount,
        LocalDate dueDate,
        LocalDate paidOn,
        String status) {
}
