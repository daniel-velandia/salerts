package com.fesc.salerts.domain.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.operation.Enrollment;
import com.fesc.salerts.domain.entities.security.User;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.student st WHERE e.group.identificator = :groupId")
    List<Enrollment> findAllByGroupIdentificatorWithStudent(@Param("groupId") UUID groupId);

    List<Enrollment> findByGroupIdentificator(UUID groupIdentificator);

    List<Enrollment> findByStudentAndGroup_AcademicPeriod(User student, AcademicPeriod period);

    Optional<Enrollment> findByIdentificator(UUID identificator);

    List<Enrollment> findByGroupId(Long groupId);

    boolean existsByGroupIdentificatorAndStudentIdentificator(UUID groupId, UUID studentId);

    @Query("SELECT COUNT(e) > 0 FROM Enrollment e " +
            "WHERE e.student.identificator = :studentId " +
            "AND e.group.subject.identificator = :subjectId " +
            "AND e.group.academicPeriod.identificator = :periodId")
    boolean existsByStudentAndSubjectInPeriod(
            @Param("studentId") UUID studentId,
            @Param("subjectId") UUID subjectId,
            @Param("periodId") UUID periodId);
}