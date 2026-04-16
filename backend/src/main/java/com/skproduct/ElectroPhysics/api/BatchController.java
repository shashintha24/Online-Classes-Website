package com.skproduct.ElectroPhysics.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.skproduct.ElectroPhysics.api.dto.BatchDto;
import com.skproduct.ElectroPhysics.api.dto.BatchUpsertRequest;
import com.skproduct.ElectroPhysics.batch.Batch;
import com.skproduct.ElectroPhysics.batch.BatchRepository;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchRepository batchRepository;

    public BatchController(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    @GetMapping("/active")
    public List<BatchDto> listActive() {
        return batchRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<BatchDto> listAll() {
        return batchRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public BatchDto create(@RequestBody BatchUpsertRequest request) {
        String name = normalizeName(request == null ? null : request.name());
        if (name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Batch name is required");
        }
        if (batchRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Batch already exists");
        }

        Batch batch = new Batch();
        batch.setName(name);
        boolean active = request == null || request.active() == null || Boolean.TRUE.equals(request.active());
        batch.setActive(active);
        return toDto(batchRepository.save(batch));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public BatchDto update(@PathVariable Long id, @RequestBody BatchUpsertRequest request) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));

        String nextName = normalizeName(request == null ? null : request.name());
        if (!nextName.isBlank() && !nextName.equalsIgnoreCase(batch.getName()) && batchRepository.existsByNameIgnoreCase(nextName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Batch already exists");
        }

        if (!nextName.isBlank()) {
            batch.setName(nextName);
        }
        if (request != null && request.active() != null) {
            batch.setActive(request.active());
        }

        return toDto(batchRepository.save(batch));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!batchRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found");
        }
        batchRepository.deleteById(id);
    }

    private BatchDto toDto(Batch batch) {
        return new BatchDto(batch.getId(), batch.getName(), batch.isActive(), batch.getCreatedAt(), batch.getUpdatedAt());
    }

    private String normalizeName(String value) {
        return value == null ? "" : value.trim();
    }
}
