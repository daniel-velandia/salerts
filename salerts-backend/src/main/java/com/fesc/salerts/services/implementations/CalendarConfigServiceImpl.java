package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.entities.configPeriod.CalendarConfig;
import com.fesc.salerts.domain.repositories.AcademicPeriodRepository;
import com.fesc.salerts.domain.repositories.CalendarConfigRepository;
import com.fesc.salerts.dtos.requests.CreateCalendarBatchRequest;
import com.fesc.salerts.dtos.requests.CreateCalendarConfigRequest;
import com.fesc.salerts.dtos.responses.CalendarConfigResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.CalendarConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarConfigServiceImpl implements CalendarConfigService {

    private final CalendarConfigRepository calendarConfigRepository;
    private final AcademicPeriodRepository academicPeriodRepository;

    @Override
    @Transactional
    public List<CalendarConfigResponse> createBatchCalendarConfig(CreateCalendarBatchRequest request) {
        AcademicPeriod period = academicPeriodRepository.findByIdentificator(request.periodId())
                .orElseThrow(() -> new ResourceNotFoundException("Periodo académico no encontrado"));

        List<CalendarConfig> existingConfigs = calendarConfigRepository.findByPeriodId(request.periodId());
        if (!existingConfigs.isEmpty()) {
            throw new IllegalArgumentException(
                    "Ya existen configuraciones de calendario para este periodo. Use la opción de editar.");
        }

        List<CalendarConfig> configsToSave = request.configs().stream().map(dateConfig -> {

            if (dateConfig.endDate().isBefore(dateConfig.startDate())) {
                throw new IllegalArgumentException("Error en el Corte " + dateConfig.noteNumber() +
                        ": La fecha final no puede ser anterior a la inicial.");
            }

            CalendarConfig config = new CalendarConfig();
            config.setPeriod(period);
            config.setNoteNumber(dateConfig.noteNumber());
            config.setStartDate(dateConfig.startDate());
            config.setEndDate(dateConfig.endDate());

            return config;
        }).collect(Collectors.toList());

        List<CalendarConfig> savedConfigs = calendarConfigRepository.saveAll(configsToSave);

        return savedConfigs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CalendarConfigResponse createCalendarConfig(CreateCalendarConfigRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("La fecha final no puede ser anterior a la fecha inicial.");
        }

        AcademicPeriod period = academicPeriodRepository.findByIdentificator(request.periodId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el periodo académico especificado."));

        if (calendarConfigRepository.existsByPeriodIdentificatorAndNoteNumber(request.periodId(),
                request.noteNumber())) {
            throw new IllegalArgumentException(
                    "Ya existe una configuración para el Corte " + request.noteNumber() + " en este periodo.");
        }

        CalendarConfig config = new CalendarConfig();
        config.setPeriod(period);
        config.setNoteNumber(request.noteNumber());
        config.setStartDate(request.startDate());
        config.setEndDate(request.endDate());

        CalendarConfig savedConfig = calendarConfigRepository.save(config);

        return mapToResponse(savedConfig);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarConfigResponse> getConfigsByPeriod(UUID periodId) {
        // Validamos que el periodo exista solo por seguridad
        if (!academicPeriodRepository.findByIdentificator(periodId).isPresent()) {
            throw new ResourceNotFoundException("Periodo académico no encontrado");
        }

        return calendarConfigRepository.findByPeriodId(periodId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CalendarConfigResponse updateDates(UUID id, LocalDateTime start, LocalDateTime end) {
        CalendarConfig config = calendarConfigRepository.findByIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException("La configuración de calendario no existe."));

        if (end.isBefore(start)) {
            throw new IllegalArgumentException(
                    "Actualización fallida: La fecha final debe ser posterior a la inicial.");
        }

        config.setStartDate(start);
        config.setEndDate(end);

        return mapToResponse(calendarConfigRepository.save(config));
    }

    private CalendarConfigResponse mapToResponse(CalendarConfig config) {
        return new CalendarConfigResponse(
                config.getIdentificator(),
                config.getNoteNumber(),
                config.getStartDate(),
                config.getEndDate(),
                config.getPeriod().getIdentificator(),
                config.getPeriod().getName());
    }
}