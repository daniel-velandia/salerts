package com.fesc.salerts.domain.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.operation.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    @Query("SELECT DISTINCT g FROM Group g " +
           "JOIN FETCH g.subject s " +
           "JOIN FETCH g.teacher t " +
           "JOIN FETCH g.academicPeriod ap " +
           "LEFT JOIN FETCH g.schedules sch " +
           "WHERE g.identificator = :identificator")
    Optional<Group> findByIdentificator(@Param("identificator") UUID identificator);

    @Query("SELECT DISTINCT g FROM Group g " +
           "JOIN FETCH g.subject s " +
           "JOIN FETCH g.teacher t " +
           "LEFT JOIN FETCH g.schedules sch " +
           "WHERE (:periodId IS NULL OR g.academicPeriod.identificator = :periodId) " +
           "AND (:teacherId IS NULL OR t.identificator = :teacherId) " +
           "AND (:subjectId IS NULL OR s.identificator = :subjectId)")
    List<Group> findByFilters(
            @Param("periodId") UUID periodId,
            @Param("teacherId") UUID teacherId,
            @Param("subjectId") UUID subjectId
    );
}
