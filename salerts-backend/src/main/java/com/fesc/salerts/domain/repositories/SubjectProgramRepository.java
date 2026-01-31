package com.fesc.salerts.domain.repositories;

import com.fesc.salerts.domain.entities.academic.SubjectProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectProgramRepository extends JpaRepository<SubjectProgram, Long> {

    @Query("SELECT sp FROM SubjectProgram sp " +
           "LEFT JOIN FETCH sp.subject " +
           "LEFT JOIN FETCH sp.program")
    List<SubjectProgram> findAllWithRelations();

    @Query("SELECT sp FROM SubjectProgram sp " +
           "JOIN FETCH sp.subject " +
           "JOIN FETCH sp.program " +
           "WHERE sp.subject.identificator = :subjectId")
    Optional<SubjectProgram> findBySubjectIdentificator(@Param("subjectId") UUID subjectId);

    @Query("SELECT sp FROM SubjectProgram sp " +
           "JOIN FETCH sp.subject s " +
           "JOIN FETCH sp.program p " +
           "WHERE (:programId IS NULL OR p.identificator = :programId) " +
           "AND (:search IS NULL OR " +
           "(LOWER(s.name) LIKE :search OR " +
           "LOWER(s.code) LIKE :search))")
    List<SubjectProgram> findByFilters(
            @Param("search") String search, 
            @Param("programId") UUID programId
    );

    // ... (El resto del código sigue igual)
    @Query("""
        SELECT COUNT(sp) > 0
        FROM SubjectProgram sp
        WHERE sp.subject.identificator = :subjectId
        AND sp.program.coordinator.identificator = :coordinatorId
    """)
    boolean coordinatorOwnsSubject(
            @Param("subjectId") UUID subjectId,
            @Param("coordinatorId") UUID coordinatorId
    );
}