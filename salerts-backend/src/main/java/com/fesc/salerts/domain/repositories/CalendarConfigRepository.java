package com.fesc.salerts.domain.repositories;

import com.fesc.salerts.domain.entities.configPeriod.CalendarConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CalendarConfigRepository extends JpaRepository<CalendarConfig, Long> {

    List<CalendarConfig> findByPeriodIdentificatorOrderByNoteNumberAsc(UUID periodIdentificator);

    Optional<CalendarConfig> findByPeriodIdentificatorAndNoteNumber(UUID periodIdentificator, Integer noteNumber);

    boolean existsByPeriodIdentificatorAndNoteNumber(UUID periodIdentificator, Integer noteNumber);

    @Query("SELECT c FROM CalendarConfig c WHERE c.period.identificator = :periodId ORDER BY c.noteNumber ASC")
    List<CalendarConfig> findByPeriodId(@Param("periodId") UUID periodId);

    @Query("SELECT COUNT(c) > 0 FROM CalendarConfig c WHERE c.period.identificator = :periodId AND c.noteNumber = :noteNumber")
    boolean existsByPeriodAndNoteNumber(@Param("periodId") UUID periodId, @Param("noteNumber") Integer noteNumber);

    Optional<CalendarConfig> findByIdentificator(UUID identificator);

    List<CalendarConfig> findAllByEndDateBetween(LocalDateTime start, LocalDateTime end);
}