package com.skproduct.ElectroPhysics.assignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassAssignmentRepository extends JpaRepository<ClassAssignment, Long> {
    List<ClassAssignment> findAllByOrderByDueDateAsc();
}