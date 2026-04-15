package com.skproduct.ElectroPhysics.api;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.NotificationDto;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.notification.Notification;
import com.skproduct.ElectroPhysics.notification.NotificationRepository;
import com.skproduct.ElectroPhysics.notification.NotificationService;
import com.skproduct.ElectroPhysics.security.CurrentUserService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final CurrentUserService currentUserService;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public NotificationController(
            CurrentUserService currentUserService,
            NotificationRepository notificationRepository,
            NotificationService notificationService) {
        this.currentUserService = currentUserService;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public List<NotificationDto> list(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        String audience = notificationService.audienceForRole(currentUser.getRole().name());
        return notificationRepository.findVisibleForUser(currentUser.getId(), audience).stream()
                .map(this::toDto)
                .toList();
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public NotificationDto markRead(@PathVariable Long id, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        String audience = notificationService.audienceForRole(currentUser.getRole().name());

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Notification not found"));

        boolean visible = currentUser.getId().equals(notification.getTargetUserId())
                || (notification.getTargetUserId() == null
                        && (audience.equalsIgnoreCase(notification.getAudience())
                                || "ALL".equalsIgnoreCase(notification.getAudience())));

        if (!visible) {
            throw new ResponseStatusException(NOT_FOUND, "Notification not found");
        }

        notification.setUnread(false);
        return toDto(notificationRepository.save(notification));
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public List<NotificationDto> markAllRead(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        String audience = notificationService.audienceForRole(currentUser.getRole().name());
        notificationService.markAllReadForUser(currentUser.getId(), audience);
        return notificationRepository.findVisibleForUser(currentUser.getId(), audience).stream()
                .map(this::toDto)
                .toList();
    }

    private NotificationDto toDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getBody(),
                notification.getType(),
                notification.isUnread(),
                notification.getCreatedAt());
    }
}
