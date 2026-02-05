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
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertEngineService {

    private final CalendarConfigRepository calendarRepository;
    private final GradeRepository gradeRepository;
    private final AlertRepository alertRepository;

    private static final String ALERT_TYPE_RISK = "ALERTA DE RENDIMIENTO";
    private static final BigDecimal PASSING_GRADE_THRESHOLD = new BigDecimal("3.00");
    
    private static final String TIME_ZONE = "America/Bogota";

    @Scheduled(cron = "0 0 3 * * *", zone = TIME_ZONE)
    @Transactional
    public void processClosingTermAlerts() {
        ZoneId zoneId = ZoneId.of(TIME_ZONE);
        LocalDate todayInColombia = LocalDate.now(zoneId);
        LocalDate yesterdayInColombia = todayInColombia.minusDays(1);
        
        LocalDateTime startOfYesterday = yesterdayInColombia.atStartOfDay();
        LocalDateTime startOfToday = todayInColombia.atStartOfDay();

        log.info(">>> ENGINE (Zona {}): Buscando cortes cerrados el {} (entre {} y {})", 
                 TIME_ZONE, yesterdayInColombia, startOfYesterday, startOfToday);

        try {
            List<CalendarConfig> closedConfigs = calendarRepository.findAllByEndDateBetween(
                    startOfYesterday,
                    startOfToday);

            if (closedConfigs.isEmpty()) {
                log.info(">>> ENGINE: No hubo cierres de corte ayer (Hora Colombia).");
                return;
            }

            for (CalendarConfig config : closedConfigs) {
                try {
                    processGradesForAlerts(config);
                } catch (Exception e) {
                    log.error("Error procesando alertas para el corte {} del periodo (ID: {}): {}",
                            config.getNoteNumber(), config.getPeriod().getIdentificator(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error crítico en el motor de alertas: ", e);
        }
    }

    private void processGradesForAlerts(CalendarConfig config) {
        log.info("Procesando reprobados para Periodo: {} | Corte: {}", 
                config.getPeriod().getName(), config.getNoteNumber());

        List<Grade> lowGrades = gradeRepository.findFailingGradesByPeriodIdentificator(
                config.getPeriod().getIdentificator(),
                config.getNoteNumber(),
                PASSING_GRADE_THRESHOLD
        );

        log.info("Se encontraron {} estudiantes en riesgo.", lowGrades.size());

        for (Grade grade : lowGrades) {
            createAlert(grade, config);
        }
    }

    private void createAlert(Grade grade, CalendarConfig config) {
        boolean alreadyExists = alertRepository.existsByEnrollmentAndTermNumberAndType(
                grade.getEnrollment(),
                grade.getTermNumber(),
                ALERT_TYPE_RISK);

        if (alreadyExists) {
            return;
        }

        Alert alert = new Alert();
        alert.setEnrollment(grade.getEnrollment());
        alert.setTermNumber(grade.getTermNumber());
        alert.setType(ALERT_TYPE_RISK);
        alert.setRegistrationDate(LocalDateTime.now(ZoneId.of(TIME_ZONE)));
        alert.setViewed(false);

        String subjectName = grade.getEnrollment().getGroup().getSubject().getName();
        
        alert.setDescription(String.format(
                "La nota en %s del Corte %d fue de %s.",
                subjectName, 
                grade.getTermNumber(), 
                grade.getValue().toString()));

        alertRepository.save(alert);
        
        log.debug("Alerta creada para: {}", grade.getEnrollment().getStudent().getEmail());
    }
}