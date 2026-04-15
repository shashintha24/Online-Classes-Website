package com.skproduct.ElectroPhysics.api;

import com.skproduct.ElectroPhysics.api.dto.TeacherProfileDto;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import com.skproduct.ElectroPhysics.teacher.TeacherProfileService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final CurrentUserService currentUserService;
    private final TeacherProfileService teacherProfileService;

    public TeacherController(CurrentUserService currentUserService, TeacherProfileService teacherProfileService) {
        this.currentUserService = currentUserService;
        this.teacherProfileService = teacherProfileService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public TeacherProfileDto myProfile(Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(FORBIDDEN, "Admin should use /api/teachers/{userId}");
        }
        if (user.getRole() != Role.TEACHER) {
            throw new ResponseStatusException(FORBIDDEN, "Only teachers can access teacher self profile");
        }
        return teacherProfileService.getByUserId(user.getId());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public TeacherProfileDto profileByUserId(@PathVariable Long userId) {
        return teacherProfileService.getByUserId(userId);
    }
}

