package com.skproduct.ElectroPhysics.api;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.AssignmentMarkRequest;
import com.skproduct.ElectroPhysics.api.dto.AssignmentSubmissionDto;
import com.skproduct.ElectroPhysics.api.dto.AssignmentSummaryDto;
import com.skproduct.ElectroPhysics.api.dto.AssignmentUpsertRequest;
import com.skproduct.ElectroPhysics.api.dto.TeacherStudentDto;
import com.skproduct.ElectroPhysics.assignment.AssignmentSubmission;
import com.skproduct.ElectroPhysics.assignment.AssignmentSubmissionRepository;
import com.skproduct.ElectroPhysics.assignment.ClassAssignment;
import com.skproduct.ElectroPhysics.assignment.ClassAssignmentRepository;
import com.skproduct.ElectroPhysics.notification.NotificationService;
import com.skproduct.ElectroPhysics.student.StudentProfile;
import com.skproduct.ElectroPhysics.student.StudentProfileRepository;

@RestController
@RequestMapping("/api/teacher/assignments")
public class AssignmentController {

    private final ClassAssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;
    private final Path assignmentUploadDir;
    private final Path submissionUploadDir;

    public AssignmentController(
            ClassAssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            StudentProfileRepository studentProfileRepository,
            NotificationService notificationService,
            @Value("${app.assignments.upload-dir:uploads/assignments}") String assignmentUploadDir,
            @Value("${app.assignments.submissions-dir:uploads/assignment-submissions}") String submissionUploadDir) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationService = notificationService;
        this.assignmentUploadDir = Paths.get(assignmentUploadDir).toAbsolutePath().normalize();
        this.submissionUploadDir = Paths.get(submissionUploadDir).toAbsolutePath().normalize();
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<TeacherStudentDto> listStudents() {
        return studentProfileRepository.findAllWithUser().stream()
                .map(profile -> new TeacherStudentDto(
                        profile.getUser().getId(),
                        profile.getUser().getUsername(),
                        profile.getFullName(),
                        profile.getGrade()))
                .toList();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<AssignmentSummaryDto> listAssignments() {
        return assignmentRepository.findAllByOrderByDueDateAsc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentSummaryDto createAssignment(@RequestBody AssignmentUpsertRequest request) {
        ClassAssignment assignment = new ClassAssignment();
        applyAssignmentPayload(assignment, request);
        ClassAssignment saved = assignmentRepository.save(assignment);
        notificationService.notifyContentChanged("Assignment created: " + saved.getTitle());
        return toSummaryDto(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public AssignmentSummaryDto updateAssignment(
            @PathVariable Long id,
            @RequestBody AssignmentUpsertRequest request) {
        ClassAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        applyAssignmentPayload(assignment, request);
        ClassAssignment saved = assignmentRepository.save(assignment);
        notificationService.notifyContentChanged("Assignment updated: " + saved.getTitle());
        return toSummaryDto(saved);
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<AssignmentSubmissionDto> listSubmissions(@PathVariable Long id) {
        return submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(id).stream()
            .map(this::toSubmissionDto)
                .toList();
    }

        @PutMapping("/submissions/{submissionId}/mark")
        @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
        public AssignmentSubmissionDto gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody AssignmentMarkRequest request) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        String mark = safeTrim(request == null ? null : request.mark());
        if (mark.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mark is required");
        }

        submission.setMark(mark);
        submission.setGraded(true);
        AssignmentSubmission saved = submissionRepository.save(submission);
        return toSubmissionDto(saved);
        }

    @PutMapping("/{assignmentId}/students/{studentUserId}/mark")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public AssignmentSubmissionDto gradeStudentWithoutSubmission(
            @PathVariable Long assignmentId,
            @PathVariable Long studentUserId,
            @RequestBody AssignmentMarkRequest request) {
        ClassAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        StudentProfile studentProfile = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        String mark = safeTrim(request == null ? null : request.mark());
        if (mark.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mark is required");
        }

        AssignmentSubmission submission = submissionRepository
                .findByAssignmentIdAndStudentUserIdOrderBySubmittedAtDesc(assignmentId, studentUserId)
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    AssignmentSubmission created = new AssignmentSubmission();
                    created.setAssignment(assignment);
                    created.setStudentUserId(studentUserId);
                    created.setStudentName(studentProfile.getFullName());
                    created.setSubmittedAt(LocalDateTime.now());
                    created.setGraded(false);
                    return created;
                });

        submission.setMark(mark);
        submission.setGraded(true);
        AssignmentSubmission saved = submissionRepository.save(submission);
        return toSubmissionDto(saved);
    }

        @PutMapping(value = "/{id}/attachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
        public AssignmentSummaryDto uploadAssignmentAttachment(
            @PathVariable Long id,
            @RequestParam MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        ClassAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        deleteIfExists(assignmentUploadDir, assignment.getStoredFileName());
        storeAssignmentFile(file, assignment);
        ClassAssignment saved = assignmentRepository.save(assignment);
        notificationService.notifyContentChanged("Assignment file updated: " + saved.getTitle());
        return toSummaryDto(saved);
        }

        @GetMapping("/{id}/download")
        @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
        public ResponseEntity<Resource> downloadAssignmentFile(@PathVariable Long id) {
        ClassAssignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));
        if (assignment.getStoredFileName() == null || assignment.getStoredFileName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment file not uploaded");
        }
        return buildDownloadResponse(
            assignmentUploadDir,
            assignment.getStoredFileName(),
            assignment.getOriginalFileName(),
            assignment.getMimeType(),
            "assignment.pdf");
        }

        @GetMapping("/submissions/{submissionId}/download")
        @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
        public ResponseEntity<Resource> downloadSubmissionFile(@PathVariable Long submissionId) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        if (submission.getStoredFileName() == null || submission.getStoredFileName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission file not uploaded");
        }

        return buildDownloadResponse(
            submissionUploadDir,
            submission.getStoredFileName(),
            submission.getFileName(),
            submission.getMimeType(),
            "submission.pdf");
        }

    private AssignmentSummaryDto toSummaryDto(ClassAssignment assignment) {
        long submittedCount = submissionRepository.countByAssignmentId(assignment.getId());
        long gradedCount = submissionRepository.countByAssignmentIdAndGradedTrue(assignment.getId());
        Integer totalStudents = assignment.getTotalStudents();
        return new AssignmentSummaryDto(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getSubject(),
                assignment.getDescription(),
                assignment.getDueDate(),
                totalStudents == null ? 0 : totalStudents,
                submittedCount,
                gradedCount,
                assignment.getStatus(),
                assignment.getOriginalFileName(),
                "/api/teacher/assignments/" + assignment.getId() + "/download",
                assignment.getStoredFileName() != null && !assignment.getStoredFileName().isBlank(),
                assignment.getCreatedAt());
    }

    private AssignmentSubmissionDto toSubmissionDto(AssignmentSubmission submission) {
        return new AssignmentSubmissionDto(
                submission.getId(),
                submission.getStudentName(),
                submission.getStudentUserId(),
                submission.getSubmittedAt(),
                submission.getFileName(),
                "/api/teacher/assignments/submissions/" + submission.getId() + "/download",
                submission.getMark(),
                submission.isGraded());
    }

    private void applyAssignmentPayload(ClassAssignment assignment, AssignmentUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String title = safeTrim(request.title());
        String subject = safeTrim(request.subject());
        String description = safeTrim(request.description());
        String status = safeTrim(request.status());

        if (title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (subject.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject is required");
        }
        if (request.dueDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Due date is required");
        }

        Integer totalStudents = request.totalStudents();
        if (totalStudents == null || totalStudents < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total students must be 0 or greater");
        }

        assignment.setTitle(title);
        assignment.setSubject(subject);
        assignment.setDescription(description);
        assignment.setDueDate(request.dueDate());
        assignment.setTotalStudents(totalStudents);
        assignment.setStatus(status.isBlank() ? "Open" : status);
    }

    private void storeAssignmentFile(MultipartFile file, ClassAssignment assignment) {
        try {
            Files.createDirectories(assignmentUploadDir);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "assignment.pdf" : file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
            String storedName = UUID.randomUUID() + extension;
            Path target = assignmentUploadDir.resolve(storedName).normalize();
            if (!target.startsWith(assignmentUploadDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            assignment.setOriginalFileName(originalName);
            assignment.setStoredFileName(storedName);
            assignment.setMimeType(file.getContentType());
            assignment.setSizeBytes(file.getSize());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save assignment file", ex);
        }
    }

    private ResponseEntity<Resource> buildDownloadResponse(
            Path baseDir,
            String storedFileName,
            String originalFileName,
            String mimeType,
            String fallbackName) {
        Path target = baseDir.resolve(storedFileName).normalize();
        if (!target.startsWith(baseDir) || !Files.exists(target)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on server");
        }

        Resource resource = new FileSystemResource(target);
        String contentType = mimeType;
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename((originalFileName == null || originalFileName.isBlank()) ? fallbackName : originalFileName)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }

    private void deleteIfExists(Path baseDir, String storedFileName) {
        if (storedFileName == null || storedFileName.isBlank()) {
            return;
        }
        Path target = baseDir.resolve(storedFileName).normalize();
        if (!target.startsWith(baseDir)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to replace existing file", ex);
        }
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }
}