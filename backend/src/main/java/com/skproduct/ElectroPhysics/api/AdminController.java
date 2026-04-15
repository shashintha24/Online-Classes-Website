package com.skproduct.ElectroPhysics.api;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.AdminStudentDto;
import com.skproduct.ElectroPhysics.api.dto.AdminStudentUpsertRequest;
import com.skproduct.ElectroPhysics.api.dto.UserDto;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.auth.UserRepository;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public List<UserDto> users() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getRole()))
                .toList();
    }

    @GetMapping("/students")
    public List<AdminStudentDto> students() {
        return studentProfileRepository.findAllWithUser().stream()
                .map(this::mapStudent)
                .toList();
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminStudentDto addStudent(@RequestBody AdminStudentUpsertRequest request) {
        validateUpsert(request, true);

        if (userRepository.existsByUsername(request.username().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (request.email() != null && !request.email().isBlank()
                && userRepository.existsByEmail(request.email().trim().toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setUsername(request.username().trim());
        user.setEmail(request.email() == null || request.email().isBlank() ? null : request.email().trim().toLowerCase(Locale.ROOT));
        user.setPassword(passwordEncoder.encode(request.password().trim()));
        user.setRole(Role.STUDENT);
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setFullName(request.fullName().trim());
        profile.setGrade(request.grade() == null || request.grade().isBlank() ? "N/A" : request.grade().trim());
        profile = studentProfileRepository.save(profile);

        return mapStudent(profile);
    }

    @PutMapping("/students/{userId}")
    public AdminStudentDto updateStudent(@PathVariable Long userId, @RequestBody AdminStudentUpsertRequest request) {
        validateUpsert(request, false);

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        User user = profile.getUser();

        String username = request.username() == null || request.username().isBlank()
                ? user.getUsername()
                : request.username().trim();
        String email = request.email() == null || request.email().isBlank()
                ? user.getEmail()
                : request.email().trim().toLowerCase(Locale.ROOT);

        userRepository.findByUsername(username).ifPresent(existing -> {
            if (!existing.getId().equals(user.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }
        });

        if (email != null) {
            userRepository.findByUsernameOrEmail(username, email).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId()) && email.equalsIgnoreCase(existing.getEmail())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                }
            });
        }

        user.setUsername(username);
        user.setEmail(email);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password().trim()));
        }
        userRepository.save(user);

        if (request.fullName() != null && !request.fullName().isBlank()) {
            profile.setFullName(request.fullName().trim());
        }
        if (request.grade() != null && !request.grade().isBlank()) {
            profile.setGrade(request.grade().trim());
        }
        profile = studentProfileRepository.save(profile);

        return mapStudent(profile);
    }

    @DeleteMapping("/students/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeStudent(@PathVariable Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        User user = profile.getUser();
        studentProfileRepository.delete(profile);
        userRepository.delete(user);
    }

    private void validateUpsert(AdminStudentUpsertRequest request, boolean requirePassword) {
        if (request.fullName() == null || request.fullName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
        }
        if (request.username() == null || request.username().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (requirePassword && (request.password() == null || request.password().isBlank() || request.password().trim().length() < 6)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        if (!requirePassword && request.password() != null && !request.password().isBlank() && request.password().trim().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
    }

    private AdminStudentDto mapStudent(StudentProfile profile) {
        return new AdminStudentDto(
                profile.getUser().getId(),
                profile.getUser().getUsername(),
                profile.getUser().getEmail(),
                profile.getFullName(),
                profile.getGrade());
    }
}

