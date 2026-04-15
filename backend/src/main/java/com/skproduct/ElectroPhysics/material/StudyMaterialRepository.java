package com.skproduct.ElectroPhysics.material;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findAllByOrderByCreatedAtDesc();
}
