package com.fesc.salerts.domain.repositories;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;

@Repository
public interface AcademicPeriodRepository extends JpaRepository<AcademicPeriod, Long> {
    Optional<AcademicPeriod> findByActiveStateTrue();
    Optional<AcademicPeriod> findByIdentificator(UUID identificator);
    boolean existsByNameIgnoreCase(String name);
    @Query("SELECT COUNT(p) > 0 FROM AcademicPeriod p WHERE p.initialDate <= :endDate AND p.endDate >= :initialDate")
    boolean existsOverlappingPeriod(@Param("initialDate") LocalDate initialDate, @Param("endDate") LocalDate endDate);
}
