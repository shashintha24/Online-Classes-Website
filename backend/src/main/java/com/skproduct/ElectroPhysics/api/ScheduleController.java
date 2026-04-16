package com.skproduct.ElectroPhysics.api;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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

import com.skproduct.ElectroPhysics.api.dto.ClassScheduleDto;
import com.skproduct.ElectroPhysics.api.dto.ClassScheduleUpsertRequest;
import com.skproduct.ElectroPhysics.api.dto.UpcomingClassDto;
import com.skproduct.ElectroPhysics.auth.Role;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.notification.NotificationService;
import com.skproduct.ElectroPhysics.schedule.ClassSchedule;
import com.skproduct.ElectroPhysics.schedule.ClassScheduleRepository;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;

@RestController
@RequestMapping("/api")
public class ScheduleController {

    private final ClassScheduleRepository scheduleRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;
    private final StudentProfileRepository studentProfileRepository;

    public ScheduleController(
            ClassScheduleRepository scheduleRepository,
            NotificationService notificationService,
            CurrentUserService currentUserService,
            StudentProfileRepository studentProfileRepository) {
        this.scheduleRepository = scheduleRepository;
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
        this.studentProfileRepository = studentProfileRepository;
    }

    @GetMapping("/teacher/schedules")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<ClassScheduleDto> listSchedulesForTeacher() {
        return scheduleRepository.findAllByOrderByStartDateAscStartTimeAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/teacher/schedules")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ClassScheduleDto createSchedule(@RequestBody ClassScheduleUpsertRequest request) {
        ClassSchedule schedule = new ClassSchedule();
        applyPayload(schedule, request);
        ClassSchedule saved = scheduleRepository.save(schedule);
        notificationService.notifySchedulePublished(saved.getTitle(), saved.getStartDate(), saved.isWeeklyRecurring());
        return toDto(saved);
    }

    @PutMapping("/teacher/schedules/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ClassScheduleDto updateSchedule(
            @PathVariable Long id,
            @RequestBody ClassScheduleUpsertRequest request) {
        ClassSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule not found"));
        applyPayload(schedule, request);
        ClassSchedule saved = scheduleRepository.save(schedule);
        return toDto(saved);
    }

    @DeleteMapping("/teacher/schedules/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchedule(@PathVariable Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule not found");
        }
        scheduleRepository.deleteById(id);
    }

    @GetMapping("/student/schedules/upcoming")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public List<UpcomingClassDto> listUpcomingSchedules(
            Authentication authentication,
            @RequestParam(defaultValue = "30") Integer limit,
            @RequestParam(defaultValue = "90") Integer horizonDays) {
        int safeLimit = limit == null || limit < 1 ? 30 : Math.min(limit, 200);
        int safeHorizonDays = horizonDays == null || horizonDays < 1 ? 90 : Math.min(horizonDays, 365);

        User currentUser = currentUserService.requireCurrentUser(authentication);
        String studentBatch = null;
        if (currentUser.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUserId(currentUser.getId()).orElse(null);
            studentBatch = profile == null || profile.getGrade() == null ? "" : profile.getGrade().trim();
            if (studentBatch.isBlank()) {
                return List.of();
            }
        }

        LocalDate today = LocalDate.now();
        LocalDate horizonDate = today.plusDays(safeHorizonDays);

        List<UpcomingClassDto> upcoming = new ArrayList<>();
        for (ClassSchedule schedule : scheduleRepository.findAllByOrderByStartDateAscStartTimeAsc()) {
            if (currentUser.getRole() == Role.STUDENT && !matchesStudentBatch(studentBatch, schedule.getBatchName())) {
                continue;
            }
            if (schedule.isWeeklyRecurring()) {
                collectRecurringOccurrences(schedule, today, horizonDate, upcoming, safeLimit);
            } else if (!schedule.getStartDate().isBefore(today) && !schedule.getStartDate().isAfter(horizonDate)) {
                upcoming.add(toUpcomingDto(schedule, schedule.getStartDate()));
            }
        }

        return upcoming.stream()
                .sorted(Comparator
                        .comparing(UpcomingClassDto::classDate)
                        .thenComparing(UpcomingClassDto::startTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(safeLimit)
                .toList();
    }

    private boolean matchesStudentBatch(String studentBatch, String scheduleBatch) {
        if (studentBatch == null || studentBatch.isBlank()) {
            return false;
        }
        if (scheduleBatch == null || scheduleBatch.isBlank()) {
            return false;
        }
        return studentBatch.equalsIgnoreCase(scheduleBatch.trim());
    }

    private void collectRecurringOccurrences(
            ClassSchedule schedule,
            LocalDate today,
            LocalDate horizonDate,
            List<UpcomingClassDto> sink,
            int maxCount) {
        LocalDate lastDate = schedule.getRecurrenceEndDate() == null
                ? horizonDate
                : schedule.getRecurrenceEndDate().isBefore(horizonDate)
                ? schedule.getRecurrenceEndDate()
                : horizonDate;

        if (lastDate.isBefore(today)) {
            return;
        }

        LocalDate first = schedule.getStartDate();
        if (first.isBefore(today)) {
            long days = ChronoUnit.DAYS.between(first, today);
            long weeks = days / 7;
            first = first.plusWeeks(weeks);
            while (first.isBefore(today)) {
                first = first.plusWeeks(1);
            }
        }

        for (LocalDate date = first; !date.isAfter(lastDate) && sink.size() < maxCount * 2; date = date.plusWeeks(1)) {
            sink.add(toUpcomingDto(schedule, date));
        }
    }

    private ClassScheduleDto toDto(ClassSchedule schedule) {
        return new ClassScheduleDto(
                schedule.getId(),
                schedule.getTitle(),
                schedule.getSubject(),
                schedule.getBatchName(),
                schedule.getDescription(),
                schedule.getStartDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.isWeeklyRecurring(),
                schedule.getRecurrenceEndDate(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt());
    }

    private UpcomingClassDto toUpcomingDto(ClassSchedule schedule, LocalDate classDate) {
        return new UpcomingClassDto(
                schedule.getId(),
                schedule.getTitle(),
                schedule.getSubject(),
                schedule.getBatchName(),
                schedule.getDescription(),
                classDate,
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.isWeeklyRecurring());
    }

    private void applyPayload(ClassSchedule schedule, ClassScheduleUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String title = safeTrim(request.title());
        String subject = safeTrim(request.subject());
        String batchName = safeTrim(request.batchName());
        String description = safeTrim(request.description());

        if (title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Class title is required");
        }
        if (request.startDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date is required");
        }
        if (request.startTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time is required");
        }
        if (request.endTime() != null && !request.endTime().isAfter(request.startTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        boolean weeklyRecurring = Boolean.TRUE.equals(request.weeklyRecurring());
        if (weeklyRecurring && request.recurrenceEndDate() != null && request.recurrenceEndDate().isBefore(request.startDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recurrence end date cannot be before start date");
        }

        schedule.setTitle(title);
        schedule.setSubject(subject.isBlank() ? "General" : subject);
        schedule.setBatchName(batchName.isBlank() ? null : batchName);
        schedule.setDescription(description);
        schedule.setStartDate(request.startDate());
        schedule.setStartTime(request.startTime());
        schedule.setEndTime(request.endTime());
        schedule.setWeeklyRecurring(weeklyRecurring);
        schedule.setRecurrenceEndDate(weeklyRecurring ? request.recurrenceEndDate() : null);
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}
