package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.configPeriod.AcademicPeriod;
import com.fesc.salerts.domain.repositories.AcademicPeriodRepository;
import com.fesc.salerts.dtos.requests.CreateAcademicPeriodRequest;
import com.fesc.salerts.dtos.responses.AcademicPeriodResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.AcademicPeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicPeriodServiceImpl implements AcademicPeriodService {

    private final AcademicPeriodRepository periodRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AcademicPeriodResponse> getAllPeriods() {
        return periodRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AcademicPeriodResponse createPeriod(CreateAcademicPeriodRequest request) {
        validatePeriodRequest(request);

        if (periodRepository.existsOverlappingPeriod(request.initialDate(), request.endDate())) {
            throw new IllegalArgumentException(
                    "Las fechas seleccionadas se solapan con un periodo académico existente.");
        }

        if (Boolean.TRUE.equals(request.activeState())) {
            desactivateCurrentActivePeriod();
        }

        AcademicPeriod period = new AcademicPeriod();
        period.setName(request.name());
        period.setInitialDate(request.initialDate());
        period.setEndDate(request.endDate());
        period.setActiveState(request.activeState());

        return mapToResponse(periodRepository.save(period));
    }

    @Override
    @Transactional
    public AcademicPeriodResponse toggleActiveState(UUID id) {
        AcademicPeriod targetPeriod = periodRepository.findByIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el periodo académico con el ID proporcionado."));

        if (Boolean.TRUE.equals(targetPeriod.getActiveState())) {
            return mapToResponse(targetPeriod);
        }

        desactivateCurrentActivePeriod();

        targetPeriod.setActiveState(true);
        return mapToResponse(periodRepository.save(targetPeriod));
    }

    private void validatePeriodRequest(CreateAcademicPeriodRequest request) {
        if (periodRepository.existsByNameIgnoreCase(request.name())) {
            throw new IllegalArgumentException("Ya existe un periodo académico con el nombre: " + request.name());
        }
        if (request.endDate().isBefore(request.initialDate())) {
            throw new IllegalArgumentException("La fecha final no puede ser anterior a la fecha inicial.");
        }
    }

    private void desactivateCurrentActivePeriod() {
        periodRepository.findByActiveStateTrue().ifPresent(currentActive -> {
            currentActive.setActiveState(false);
            periodRepository.save(currentActive);
        });
    }

    private AcademicPeriodResponse mapToResponse(AcademicPeriod period) {
        return new AcademicPeriodResponse(
                period.getIdentificator(),
                period.getName(),
                period.getInitialDate(),
                period.getEndDate(),
                period.getActiveState());
    }
}