package com.skproduct.ElectroPhysics.api;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.AuthResponse;
import com.skproduct.ElectroPhysics.api.dto.LoginRequest;
import com.skproduct.ElectroPhysics.api.dto.RegisterRequest;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.auth.UserRepository;
import com.skproduct.ElectroPhysics.batch.BatchRepository;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;
import com.skproduct.ElectroPhysics.teacher.TeacherProfile;
import com.skproduct.ElectroPhysics.teacher.TeacherProfileRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BatchRepository batchRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            BatchRepository batchRepository,
            StudentProfileRepository studentProfileRepository,
            TeacherProfileRepository teacherProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.batchRepository = batchRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.teacherProfileRepository = teacherProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        validateRegister(request);

        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (userRepository.existsByEmail(request.email().toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Role role = parseRole(request.role());
        String grade = request.grade() == null ? "" : request.grade().trim();

        if (role == Role.STUDENT) {
            if (grade.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Batch is required for student registration");
            }
            if (!batchRepository.existsByNameIgnoreCaseAndActiveTrue(grade)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected batch is not available");
            }
        }

        User user = new User();
        user.setUsername(request.username().trim());
        user.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user = userRepository.save(user);

        if (role == Role.STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setFullName(request.fullName().trim());
            profile.setGrade(grade);
            studentProfileRepository.save(profile);
        } else {
            TeacherProfile profile = new TeacherProfile();
            profile.setUser(user);
            profile.setFullName(request.fullName().trim());
            profile.setSubject(request.subject() == null || request.subject().isBlank() ? "General" : request.subject().trim());
            teacherProfileRepository.save(profile);
        }

        return toAuthResponse(user, request.password());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        if (request.login() == null || request.login().isBlank() || request.password() == null || request.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login and password are required");
        }

        User user = userRepository.findByUsernameOrEmail(request.login().trim(), request.login().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return toAuthResponse(user, request.password());
    }

    private void validateRegister(RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (request.password() == null || request.password().isBlank() || request.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        if (request.fullName() == null || request.fullName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
        }
        parseRole(request.role());
    }

    private Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }
        try {
            return Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

    private AuthResponse toAuthResponse(User user, String rawPassword) {
        String token = Base64.getEncoder()
                .encodeToString((user.getUsername() + ":" + rawPassword).getBytes(StandardCharsets.UTF_8));
        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), token);
    }
}
