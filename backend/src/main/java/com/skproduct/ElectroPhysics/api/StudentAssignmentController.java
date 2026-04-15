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
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.AssignmentSubmissionDetailDto;
import com.skproduct.ElectroPhysics.api.dto.AssignmentSummaryDto;
import com.skproduct.ElectroPhysics.assignment.AssignmentSubmission;
import com.skproduct.ElectroPhysics.assignment.AssignmentSubmissionRepository;
import com.skproduct.ElectroPhysics.assignment.ClassAssignment;
import com.skproduct.ElectroPhysics.assignment.ClassAssignmentRepository;
import com.skproduct.ElectroPhysics.assignment.SubmissionLike;
import com.skproduct.ElectroPhysics.assignment.SubmissionLikeRepository;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.security.CurrentUserService;

@RestController
@RequestMapping("/api/student/assignments")
public class StudentAssignmentController {

    private final ClassAssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final SubmissionLikeRepository likeRepository;
    private final CurrentUserService currentUserService;
    private final Path assignmentUploadDir;
    private final Path submissionUploadDir;

    public StudentAssignmentController(
            ClassAssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            SubmissionLikeRepository likeRepository,
            CurrentUserService currentUserService,
            @Value("${app.assignments.upload-dir:uploads/assignments}") String assignmentUploadDir,
            @Value("${app.assignments.submissions-dir:uploads/assignment-submissions}") String submissionUploadDir) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.likeRepository = likeRepository;
        this.currentUserService = currentUserService;
        this.assignmentUploadDir = Paths.get(assignmentUploadDir).toAbsolutePath().normalize();
        this.submissionUploadDir = Paths.get(submissionUploadDir).toAbsolutePath().normalize();
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public List<AssignmentSummaryDto> listAssignments() {
        return assignmentRepository.findAllByOrderByDueDateAsc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AssignmentSubmissionDetailDto> listSubmissions(
            @PathVariable Long id,
            Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        return submissionRepository.findByAssignmentIdAndStudentUserIdOrderBySubmittedAtDesc(id, currentUser.getId()).stream()
                .map(submission -> toDetailDto(submission, currentUser.getId()))
                .toList();
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentSubmissionDetailDto submitAssignment(
            @PathVariable Long id,
            MultipartFile file,
            Authentication authentication) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Submission file is required");
        }

        User currentUser = currentUserService.requireCurrentUser(authentication);
        ClassAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudentName(currentUser.getUsername());
        submission.setStudentUserId(currentUser.getId());
        submission.setSubmittedAt(LocalDateTime.now());
        storeSubmissionFile(file, submission);
        submission.setGraded(false);
        AssignmentSubmission saved = submissionRepository.save(submission);

        return toDetailDto(saved, currentUser.getId());
    }

    @PostMapping("/submissions/{submissionId}/like")
    @PreAuthorize("hasRole('STUDENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public void likeSubmission(
            @PathVariable Long submissionId,
            Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        if (likeRepository.existsBySubmissionIdAndStudentUserId(submissionId, currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already liked");
        }

        SubmissionLike like = new SubmissionLike();
        like.setSubmission(submission);
        like.setStudentUserId(currentUser.getId());
        likeRepository.save(like);
    }

    @DeleteMapping("/submissions/{submissionId}/like")
    @PreAuthorize("hasRole('STUDENT')")
    public void unlikeSubmission(
            @PathVariable Long submissionId,
            Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        likeRepository.deleteBySubmissionIdAndStudentUserId(submissionId, currentUser.getId());
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('STUDENT')")
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
                "/api/student/assignments/" + assignment.getId() + "/download",
                assignment.getStoredFileName() != null && !assignment.getStoredFileName().isBlank(),
                assignment.getCreatedAt());
    }

    private AssignmentSubmissionDetailDto toDetailDto(AssignmentSubmission submission, Long currentUserId) {
        long likeCount = likeRepository.countBySubmissionId(submission.getId());
        boolean likedByCurrentUser = likeRepository.existsBySubmissionIdAndStudentUserId(submission.getId(), currentUserId);
        return new AssignmentSubmissionDetailDto(
                submission.getId(),
                submission.getStudentName(),
                submission.getStudentUserId(),
                submission.getSubmittedAt(),
                submission.getFileName(),
                "/api/teacher/assignments/submissions/" + submission.getId() + "/download",
                submission.getMark(),
                submission.isGraded(),
                likeCount,
                likedByCurrentUser);
    }

    private void storeSubmissionFile(MultipartFile file, AssignmentSubmission submission) {
        try {
            Files.createDirectories(submissionUploadDir);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "submission.pdf" : file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
            String storedName = UUID.randomUUID() + extension;
            Path target = submissionUploadDir.resolve(storedName).normalize();
            if (!target.startsWith(submissionUploadDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            submission.setFileName(originalName);
            submission.setStoredFileName(storedName);
            submission.setMimeType(file.getContentType());
            submission.setSizeBytes(file.getSize());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save submission file", ex);
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
}
