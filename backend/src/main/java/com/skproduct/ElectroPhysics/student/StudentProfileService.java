package com.skproduct.ElectroPhysics.student;

import com.skproduct.ElectroPhysics.api.dto.StudentProfileDto;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    public StudentProfileDto getByUserId(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student profile not found"));
        return new StudentProfileDto(profile.getUser().getId(), profile.getFullName(), profile.getGrade());
    }
}

