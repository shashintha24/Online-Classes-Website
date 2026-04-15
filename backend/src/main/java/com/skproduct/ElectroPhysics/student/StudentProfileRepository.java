package com.skproduct.ElectroPhysics.student;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);

    @Query("select sp from StudentProfile sp join fetch sp.user")
    java.util.List<StudentProfile> findAllWithUser();
}
