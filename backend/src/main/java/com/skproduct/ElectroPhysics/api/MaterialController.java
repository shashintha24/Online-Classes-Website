package com.skproduct.ElectroPhysics.api;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.skproduct.ElectroPhysics.api.dto.StudyMaterialDto;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.material.StudyMaterial;
import com.skproduct.ElectroPhysics.material.StudyMaterialRepository;
import com.skproduct.ElectroPhysics.notification.NotificationService;
import com.skproduct.ElectroPhysics.security.CurrentUserService;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final StudyMaterialRepository studyMaterialRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final Path uploadDir;

    public MaterialController(
            StudyMaterialRepository studyMaterialRepository,
            CurrentUserService currentUserService,
            NotificationService notificationService,
            @Value("${app.materials.upload-dir:uploads/materials}") String uploadDir) {
        this.studyMaterialRepository = studyMaterialRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public List<StudyMaterialDto> list(
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String type) {
        return studyMaterialRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(material -> matchesFilter(batch, material.getBatchName()))
                .filter(material -> matchesFilter(type, material.getMaterialType()))
                .map(this::toDto)
                .toList();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public StudyMaterialDto upload(
            Authentication authentication,
            @RequestParam String title,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String batchName,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String externalUrl,
            @RequestParam(required = false) MultipartFile file) {

        String cleanTitle = safeTrim(title);
        if (cleanTitle.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }

        String cleanExternal = safeTrim(externalUrl);
        boolean hasFile = file != null && !file.isEmpty();
        if (!hasFile && cleanExternal.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload a file or provide a link");
        }
        if (!cleanExternal.isBlank() && !isValidExternalUrl(cleanExternal)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "External URL must start with http:// or https://");
        }

        User user = currentUserService.requireCurrentUser(authentication);
        StudyMaterial material = new StudyMaterial();
        material.setTitle(cleanTitle);
        material.setMaterialType(safeTrim(materialType).isBlank() ? "OTHER" : safeTrim(materialType).toUpperCase(Locale.ROOT));
        material.setBatchName(safeTrim(batchName).isBlank() ? "General" : safeTrim(batchName));
        material.setDescription(safeTrim(description));
        material.setExternalUrl(cleanExternal.isBlank() ? null : cleanExternal);
        material.setUploadedByUserId(user.getId());

        if (hasFile) {
            storeFile(file, material);
        }

        StudyMaterial saved = studyMaterialRepository.save(material);
        notificationService.notifyContentChanged("Study material: " + saved.getTitle());
        return toDto(saved);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found"));

        if (material.getExternalUrl() != null && !material.getExternalUrl().isBlank()) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(material.getExternalUrl()))
                    .build();
        }

        if (material.getStoredFileName() == null || material.getStoredFileName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No downloadable file found");
        }

        Path target = uploadDir.resolve(material.getStoredFileName()).normalize();
        if (!target.startsWith(uploadDir) || !Files.exists(target)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on server");
        }

        Resource resource = new FileSystemResource(target);
        String contentType = material.getMimeType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        ContentDisposition disposition = ContentDisposition.attachment()
            .filename(material.getOriginalFileName() == null ? "material" : material.getOriginalFileName())
            .build();

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
            .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found"));

        if (material.getStoredFileName() != null && !material.getStoredFileName().isBlank()) {
            Path target = uploadDir.resolve(material.getStoredFileName()).normalize();
            if (target.startsWith(uploadDir)) {
                try {
                    Files.deleteIfExists(target);
                } catch (IOException ex) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to delete file", ex);
                }
            }
        }

        studyMaterialRepository.delete(material);
        notificationService.notifyContentChanged("Study material removed: " + material.getTitle());
    }

    private void storeFile(MultipartFile file, StudyMaterial material) {
        try {
            Files.createDirectories(uploadDir);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "upload.bin" : file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
            String storedName = UUID.randomUUID() + extension;
            Path target = uploadDir.resolve(storedName).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            material.setOriginalFileName(originalName);
            material.setStoredFileName(storedName);
            material.setMimeType(file.getContentType());
            material.setSizeBytes(file.getSize());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save file", ex);
        }
    }

    private StudyMaterialDto toDto(StudyMaterial material) {
        return new StudyMaterialDto(
                material.getId(),
                material.getTitle(),
                material.getMaterialType(),
                material.getBatchName(),
                material.getDescription(),
                material.getOriginalFileName(),
                material.getSizeBytes(),
                material.getMimeType(),
                material.getExternalUrl(),
                "/api/materials/" + material.getId() + "/download",
                material.getExternalUrl() != null && !material.getExternalUrl().isBlank(),
                material.getCreatedAt());
    }

    private boolean matchesFilter(String filter, String value) {
        if (filter == null || filter.isBlank()) {
            return true;
        }
        if (value == null) {
            return false;
        }
        return value.equalsIgnoreCase(filter.trim());
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isValidExternalUrl(String url) {
        String lower = url.toLowerCase(Locale.ROOT);
        return lower.startsWith("http://") || lower.startsWith("https://");
    }
}
