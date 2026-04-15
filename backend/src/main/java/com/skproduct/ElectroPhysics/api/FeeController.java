package com.skproduct.ElectroPhysics.api;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.FeeRecordDto;
import com.skproduct.ElectroPhysics.api.dto.FeeUpsertRequest;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.fee.StudentFee;
import com.skproduct.ElectroPhysics.fee.StudentFeeRepository;
import com.skproduct.ElectroPhysics.notification.NotificationService;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;

@RestController
@RequestMapping("/api")
public class FeeController {

    private static final Pattern MONTH_PATTERN = Pattern.compile("^\\d{4}-\\d{2}$");

    private final StudentFeeRepository studentFeeRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public FeeController(
            StudentFeeRepository studentFeeRepository,
            StudentProfileRepository studentProfileRepository,
            CurrentUserService currentUserService,
            NotificationService notificationService) {
        this.studentFeeRepository = studentFeeRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @GetMapping("/teacher/fees")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<FeeRecordDto> teacherFees(@RequestParam(required = false) String month) {
        String normalizedMonth = safeTrim(month);
        if (normalizedMonth.isBlank()) {
            normalizedMonth = LocalDate.now().toString().substring(0, 7);
        }
        validateMonth(normalizedMonth);
        return studentFeeRepository.findByFeeMonthOrderByStudentNameAsc(normalizedMonth).stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/teacher/fees")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public FeeRecordDto upsertFee(@RequestBody FeeUpsertRequest request) {
        if (request == null || request.studentUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student is required");
        }

        String feeMonth = safeTrim(request.feeMonth());
        validateMonth(feeMonth);

        if (request.amount() == null || request.amount().doubleValue() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than zero");
        }

        if (request.dueDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Due date is required");
        }

        StudentProfile studentProfile = studentProfileRepository.findByUserId(request.studentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        StudentFee fee = studentFeeRepository.findByStudentUserIdAndFeeMonth(request.studentUserId(), feeMonth)
                .orElseGet(StudentFee::new);

        fee.setStudentUserId(request.studentUserId());
        fee.setStudentName(studentProfile.getFullName());
        fee.setGrade(studentProfile.getGrade());
        fee.setFeeMonth(feeMonth);
        fee.setAmount(request.amount());
        fee.setDueDate(request.dueDate());
        fee.setPaidOn(request.paidOn());
        fee.setStatus(request.paidOn() == null ? "Pending" : "Paid");

        StudentFee saved = studentFeeRepository.save(fee);
        if (saved.getPaidOn() != null) {
            notificationService.notifyFeePaid(saved.getStudentUserId(), saved.getStudentName(), saved.getFeeMonth(), saved.getAmount());
        }
        return toDto(saved);
    }

    @PutMapping("/teacher/fees/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public FeeRecordDto markPaid(@PathVariable Long id) {
        StudentFee fee = studentFeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fee record not found"));

        fee.setPaidOn(LocalDate.now());
        fee.setStatus("Paid");
        StudentFee saved = studentFeeRepository.save(fee);
        notificationService.notifyFeePaid(saved.getStudentUserId(), saved.getStudentName(), saved.getFeeMonth(), saved.getAmount());
        return toDto(saved);
    }

    @GetMapping("/student/fees")
    @PreAuthorize("hasRole('STUDENT')")
    public List<FeeRecordDto> studentFees(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        return studentFeeRepository.findByStudentUserIdOrderByFeeMonthDescDueDateDesc(currentUser.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    private FeeRecordDto toDto(StudentFee fee) {
        return new FeeRecordDto(
                fee.getId(),
                fee.getStudentUserId(),
                fee.getStudentName(),
                fee.getGrade(),
                fee.getFeeMonth(),
                fee.getAmount(),
                fee.getDueDate(),
                fee.getPaidOn(),
                fee.getStatus());
    }

    private void validateMonth(String month) {
        if (month == null || month.isBlank() || !MONTH_PATTERN.matcher(month).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "feeMonth must be in YYYY-MM format");
        }
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
