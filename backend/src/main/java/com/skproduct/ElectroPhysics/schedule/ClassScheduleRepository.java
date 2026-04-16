package com.skproduct.ElectroPhysics.schedule;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
    List<ClassSchedule> findAllByOrderByStartDateAscStartTimeAsc();
}
