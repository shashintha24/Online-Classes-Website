package com.skproduct.ElectroPhysics.batch;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findAllByOrderByNameAsc();

    List<Batch> findByActiveTrueOrderByNameAsc();

    Optional<Batch> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);
}
