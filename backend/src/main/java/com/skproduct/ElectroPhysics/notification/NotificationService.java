package com.skproduct.ElectroPhysics.notification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createForAudience(String audience, String title, String body, String type) {
        Notification notification = new Notification();
        notification.setAudience(normalizeAudience(audience));
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType(type == null || type.isBlank() ? "GENERAL" : type.toUpperCase(Locale.ROOT));
        return notificationRepository.save(notification);
    }

    public Notification createForUser(Long userId, String audience, String title, String body, String type) {
        Notification notification = new Notification();
        notification.setAudience(normalizeAudience(audience));
        notification.setTargetUserId(userId);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType(type == null || type.isBlank() ? "GENERAL" : type.toUpperCase(Locale.ROOT));
        return notificationRepository.save(notification);
    }

    public void notifyContentChanged(String contentLabel) {
        String body = contentLabel + " was updated by teacher.";
        createForAudience("STUDENT", "Content updated", body, "CONTENT");
        createForAudience("TEACHER", "Content updated", body, "CONTENT");
    }

    public void notifyFeePaid(Long studentUserId, String studentName, String feeMonth, BigDecimal amount) {
        String amountText = amount == null ? "0" : amount.stripTrailingZeros().toPlainString();
        createForUser(
                studentUserId,
                "STUDENT",
                "Fee payment confirmed",
                "Your " + feeMonth + " fee payment (LKR " + amountText + ") is marked as Paid.",
                "FEE");

        createForAudience(
                "TEACHER",
                "Fee marked paid",
                studentName + " fee for " + feeMonth + " is marked as Paid.",
                "FEE");
    }

    public void notifySchedulePublished(String classTitle, LocalDate date, boolean weeklyRecurring) {
        String whenText = date == null ? "soon" : date.toString();
        String recurrence = weeklyRecurring ? " (repeats weekly)" : "";
        String body = classTitle + " scheduled for " + whenText + recurrence + ".";

        createForAudience("STUDENT", "New class schedule", body, "SCHEDULE");
        createForAudience("TEACHER", "New class schedule", body, "SCHEDULE");
    }

    public String audienceForRole(String roleName) {
        if (roleName == null) return "ALL";
        String value = roleName.toUpperCase(Locale.ROOT);
        if ("STUDENT".equals(value) || "TEACHER".equals(value) || "ADMIN".equals(value)) {
            return value;
        }
        return "ALL";
    }

    @Transactional
    public int markAllReadForUser(Long userId, String audience) {
        return notificationRepository.markAllReadForUser(userId, normalizeAudience(audience));
    }

    private String normalizeAudience(String audience) {
        if (audience == null || audience.isBlank()) return "ALL";
        String value = audience.toUpperCase(Locale.ROOT);
        if ("STUDENT".equals(value) || "TEACHER".equals(value) || "ADMIN".equals(value) || "ALL".equals(value)) {
            return value;
        }
        return "ALL";
    }
}
