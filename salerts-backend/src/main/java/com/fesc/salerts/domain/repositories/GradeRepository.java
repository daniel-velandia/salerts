package com.fesc.salerts.domain.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Grade;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByEnrollmentIn(List<Enrollment> enrollments);

    Optional<Grade> findByEnrollmentAndTermNumber(Enrollment enrollment, Integer termNumber);

    List<Grade> findByEnrollment(Enrollment enrollment);

    List<Grade> findByTermNumberAndValueLessThan(Integer termNumber, BigDecimal value);

    @Query("SELECT g FROM Grade g " +
            "JOIN FETCH g.enrollment e " +
            "WHERE e.group.id = :groupId AND g.termNumber = :termNumber")
    List<Grade> findByGroupIdAndTermNumber(@Param("groupId") Long groupId,
            @Param("termNumber") Integer termNumber);
}
