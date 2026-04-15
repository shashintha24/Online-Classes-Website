package com.skproduct.ElectroPhysics.teacher;

import com.skproduct.ElectroPhysics.api.dto.TeacherProfileDto;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class TeacherProfileService {

    private final TeacherProfileRepository teacherProfileRepository;

    public TeacherProfileService(TeacherProfileRepository teacherProfileRepository) {
        this.teacherProfileRepository = teacherProfileRepository;
    }

    public TeacherProfileDto getByUserId(Long userId) {
        TeacherProfile profile = teacherProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Teacher profile not found"));
        return new TeacherProfileDto(profile.getUser().getId(), profile.getFullName(), profile.getSubject());
    }
}

