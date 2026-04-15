package com.skproduct.ElectroPhysics.api;

import com.skproduct.ElectroPhysics.api.dto.StudentProfileDto;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import com.skproduct.ElectroPhysics.student.StudentProfileService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final CurrentUserService currentUserService;
    private final StudentProfileService studentProfileService;

    public StudentController(CurrentUserService currentUserService, StudentProfileService studentProfileService) {
        this.currentUserService = currentUserService;
        this.studentProfileService = studentProfileService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public StudentProfileDto myProfile(Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(FORBIDDEN, "Admin should use /api/students/{userId}");
        }
        if (user.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(FORBIDDEN, "Only students can access student self profile");
        }
        return studentProfileService.getByUserId(user.getId());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentProfileDto profileByUserId(@PathVariable Long userId) {
        return studentProfileService.getByUserId(userId);
    }
}
