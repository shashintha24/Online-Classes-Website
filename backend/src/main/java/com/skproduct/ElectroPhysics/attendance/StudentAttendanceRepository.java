package com.skproduct.ElectroPhysics.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
    Optional<StudentAttendance> findByStudentUserIdAndAttendanceDate(Long studentUserId, LocalDate attendanceDate);

    List<StudentAttendance> findByAttendanceDateOrderByCheckInTimeAsc(LocalDate attendanceDate);

    List<StudentAttendance> findByStudentUserIdOrderByAttendanceDateDesc(Long studentUserId);
}
