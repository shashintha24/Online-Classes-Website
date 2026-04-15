package com.skproduct.ElectroPhysics.fee;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentFeeRepository extends JpaRepository<StudentFee, Long> {
    List<StudentFee> findByFeeMonthOrderByStudentNameAsc(String feeMonth);

    List<StudentFee> findByStudentUserIdOrderByFeeMonthDescDueDateDesc(Long studentUserId);

    Optional<StudentFee> findByStudentUserIdAndFeeMonth(Long studentUserId, String feeMonth);
}
