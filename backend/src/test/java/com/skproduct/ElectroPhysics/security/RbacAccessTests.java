package com.skproduct.ElectroPhysics.security;

import com.skproduct.ElectroPhysics.api.AdminController;
import com.skproduct.ElectroPhysics.api.StudentController;
import com.skproduct.ElectroPhysics.api.TeacherController;
import com.skproduct.ElectroPhysics.api.dto.StudentProfileDto;
import com.skproduct.ElectroPhysics.api.dto.TeacherProfileDto;
import com.skproduct.ElectroPhysics.auth.UserRepository;
import java.util.function.Supplier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class RbacAccessTests {

    @Autowired
    private StudentController studentController;

    @Autowired
    private TeacherController teacherController;

    @Autowired
    private AdminController adminController;

    @Autowired
    private UserRepository userRepository;

    @Test
    void studentCanReadOnlyStudentOwnData() {
        Authentication studentAuth = auth("student1", "ROLE_STUDENT");

        StudentProfileDto own = runAs(studentAuth, () -> studentController.myProfile(studentAuth));
        assertThat(own.fullName()).isEqualTo("Student One");

        assertThatThrownBy(() -> runAs(studentAuth, () -> teacherController.myProfile(studentAuth)))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void teacherCanReadOnlyTeacherOwnData() {
        Authentication teacherAuth = auth("teacher1", "ROLE_TEACHER");

        TeacherProfileDto own = runAs(teacherAuth, () -> teacherController.myProfile(teacherAuth));
        assertThat(own.fullName()).isEqualTo("Teacher One");

        assertThatThrownBy(() -> runAs(teacherAuth, () -> studentController.myProfile(teacherAuth)))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void adminCanReadEveryoneData() {
        Authentication adminAuth = auth("admin1", "ROLE_ADMIN");
        Long studentUserId = userRepository.findByUsername("student1").orElseThrow().getId();
        Long teacherUserId = userRepository.findByUsername("teacher1").orElseThrow().getId();

        assertThat(runAs(adminAuth, () -> adminController.users())).isNotEmpty();
        assertThat(runAs(adminAuth, () -> studentController.profileByUserId(studentUserId)).userId()).isEqualTo(studentUserId);
        assertThat(runAs(adminAuth, () -> teacherController.profileByUserId(teacherUserId)).userId()).isEqualTo(teacherUserId);
    }

    private Authentication auth(String username, String role) {
        return UsernamePasswordAuthenticationToken.authenticated(username, "N/A", java.util.List.of(() -> role));
    }

    private <T> T runAs(Authentication authentication, Supplier<T> task) {
        SecurityContextHolder.getContext().setAuthentication(authentication);
        try {
            return task.get();
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
