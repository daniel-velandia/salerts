package com.fesc.salerts.domain.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.operation.Grade;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

        @Query("SELECT g FROM Grade g " +
                        "JOIN FETCH g.enrollment e " +
                        "WHERE e.group.identificator = :groupId AND g.termNumber = :termNumber")
        List<Grade> findByGroupIdentificatorAndTermNumber(@Param("groupId") UUID groupId,
                        @Param("termNumber") Integer termNumber);

        List<Grade> findByEnrollmentIn(List<Enrollment> enrollments);

        Optional<Grade> findByEnrollmentAndTermNumber(Enrollment enrollment, Integer termNumber);

        List<Grade> findByEnrollment(Enrollment enrollment);

        List<Grade> findByTermNumberAndValueLessThan(Integer termNumber, BigDecimal value);

        @Query("SELECT g FROM Grade g " +
                        "JOIN FETCH g.enrollment e " +
                        "JOIN e.group gr " +
                        "JOIN gr.academicPeriod p " +
                        "WHERE p.identificator = :periodId " +
                        "AND g.termNumber = :termNumber " +
                        "AND g.value < :threshold")
        List<Grade> findFailingGradesByPeriodIdentificator(
                        @Param("periodId") UUID periodId,
                        @Param("termNumber") Integer termNumber,
                        @Param("threshold") BigDecimal threshold);
}