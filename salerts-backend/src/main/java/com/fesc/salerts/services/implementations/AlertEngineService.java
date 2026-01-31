package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.alerts.Alert;
import com.fesc.salerts.domain.entities.configPeriod.CalendarConfig;
import com.fesc.salerts.domain.entities.operation.Grade;
import com.fesc.salerts.domain.repositories.AlertRepository;
import com.fesc.salerts.domain.repositories.CalendarConfigRepository;
import com.fesc.salerts.domain.repositories.GradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertEngineService {

    private final CalendarConfigRepository calendarRepository;
    private final GradeRepository gradeRepository;
    private final AlertRepository alertRepository;

    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void processClosingTermAlerts() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        log.info("Iniciando procesamiento de alertas para cortes cerrados el: {}", yesterday);

        try {
            List<CalendarConfig> closedConfigs = calendarRepository.findAllByEndDateBetween(
                    yesterday.atStartOfDay(),
                    yesterday.atTime(23, 59, 59));

            for (CalendarConfig config : closedConfigs) {
                try {
                    processGradesForAlerts(config);
                } catch (Exception e) {
                    log.error("Error procesando alertas para el corte {} del periodo {}: {}",
                            config.getNoteNumber(), config.getPeriod().getName(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error crítico en el motor de alertas: ", e);
        }
    }

    private void processGradesForAlerts(CalendarConfig config) {
        List<Grade> lowGrades = gradeRepository.findByTermNumberAndValueLessThan(
                config.getNoteNumber(),
                new BigDecimal("3.0"));

        for (Grade grade : lowGrades) {
            createAlert(grade, config);
        }
    }

    private void createAlert(Grade grade, CalendarConfig config) {
        boolean alreadyExists = alertRepository.existsByEnrollmentAndTermNumberAndType(
                grade.getEnrollment(),
                grade.getTermNumber(),
                "ACADEMIC_RISK");

        if (alreadyExists) {
            log.info("Alerta omitida: Ya se procesó el corte {} para el estudiante {}",
                    grade.getTermNumber(), grade.getEnrollment().getStudent().getEmail());
            return;
        }

        Alert alert = new Alert();
        alert.setEnrollment(grade.getEnrollment());
        alert.setTermNumber(grade.getTermNumber());
        alert.setType("ACADEMIC_RISK");
        alert.setRegistrationDate(LocalDateTime.now());
        alert.setViewed(false);

        String subjectName = grade.getEnrollment().getGroup().getSubject().getName();
        alert.setDescription(String.format(
                "Alerta de rendimiento: Tu nota en la materia %s para el corte %d fue de %s. Recuerda que el mínimo aprobatorio es 3.0.",
                subjectName, grade.getTermNumber(), grade.getValue().toString()));

        alertRepository.save(alert);
        log.info("Alerta generada para el estudiante: {} en la materia: {}",
                grade.getEnrollment().getStudent().getEmail(), subjectName);
    }
}