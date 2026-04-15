package com.skproduct.ElectroPhysics.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.AttendanceRecordDto;
import com.skproduct.ElectroPhysics.api.dto.AttendanceScanRequest;
import com.skproduct.ElectroPhysics.api.dto.StudentAttendanceQrDto;
import com.skproduct.ElectroPhysics.attendance.StudentAttendance;
import com.skproduct.ElectroPhysics.attendance.StudentAttendanceRepository;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final CurrentUserService currentUserService;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentAttendanceRepository attendanceRepository;

    public AttendanceController(
            CurrentUserService currentUserService,
            StudentProfileRepository studentProfileRepository,
            StudentAttendanceRepository attendanceRepository) {
        this.currentUserService = currentUserService;
        this.studentProfileRepository = studentProfileRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/student/attendance/qr")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentAttendanceQrDto studentQr(Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        StudentProfile studentProfile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));

        LocalDate today = LocalDate.now();
        StudentAttendance attendance = attendanceRepository.findByStudentUserIdAndAttendanceDate(user.getId(), today)
                .orElse(null);

        return new StudentAttendanceQrDto(
                user.getId(),
                studentProfile.getFullName(),
                studentProfile.getGrade(),
                buildQrCode(user.getId()),
                attendance != null,
                attendance == null ? "Not Marked" : attendance.getStatus(),
                attendance == null ? "-" : attendance.getCheckInTime().format(TIME_FORMAT));
    }

    @GetMapping("/student/attendance/log")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AttendanceRecordDto> studentAttendanceLog(Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        return attendanceRepository.findByStudentUserIdOrderByAttendanceDateDesc(user.getId()).stream()
                .limit(30)
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/teacher/attendance/today")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<AttendanceRecordDto> todayAttendance() {
        return attendanceRepository.findByAttendanceDateOrderByCheckInTimeAsc(LocalDate.now()).stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/teacher/attendance/scan")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceRecordDto scanAndMark(@RequestBody AttendanceScanRequest request) {
        String qrCode = safeTrim(request == null ? null : request.qrCode());
        if (qrCode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "QR code is required");
        }

        Long studentUserId = parseStudentIdFromQr(qrCode);
        StudentProfile studentProfile = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found for scanned QR"));

        LocalDate today = LocalDate.now();
        StudentAttendance attendance = attendanceRepository.findByStudentUserIdAndAttendanceDate(studentUserId, today)
                .orElseGet(() -> {
                    StudentAttendance created = new StudentAttendance();
                    created.setStudentUserId(studentUserId);
                    created.setStudentName(studentProfile.getFullName());
                    created.setGrade(studentProfile.getGrade());
                    created.setAttendanceDate(today);
                    return created;
                });

        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setMethod("QR scan");
        attendance.setStatus("Present");

        StudentAttendance saved = attendanceRepository.save(attendance);
        return toDto(saved);
    }

    private AttendanceRecordDto toDto(StudentAttendance attendance) {
        return new AttendanceRecordDto(
                attendance.getId(),
                attendance.getStudentUserId(),
                attendance.getStudentName(),
                attendance.getGrade(),
                attendance.getAttendanceDate(),
                attendance.getCheckInTime(),
                attendance.getMethod(),
                attendance.getStatus());
    }

    private String buildQrCode(Long studentUserId) {
        return "EPATT-" + studentUserId;
    }

    private Long parseStudentIdFromQr(String qrCode) {
        String normalized = safeTrim(qrCode).toUpperCase();
        if (!normalized.startsWith("EPATT-")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid QR code format");
        }

        String studentIdPart = normalized.substring("EPATT-".length()).trim();
        try {
            return Long.valueOf(studentIdPart);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid QR code value");
        }
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
