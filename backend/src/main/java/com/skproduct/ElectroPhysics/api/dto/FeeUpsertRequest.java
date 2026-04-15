package com.skproduct.ElectroPhysics.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FeeUpsertRequest(
        Long studentUserId,
        String feeMonth,
        BigDecimal amount,
        LocalDate dueDate,
        LocalDate paidOn) {
}
