package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.security.User;
import com.fesc.salerts.domain.enums.AppRole;
import com.fesc.salerts.domain.repositories.ProgramRepository;
import com.fesc.salerts.domain.repositories.UserRepository;
import com.fesc.salerts.dtos.requests.CreateProgramRequest;
import com.fesc.salerts.dtos.responses.ProgramResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramRepository programRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProgramResponse> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProgramResponse createProgram(CreateProgramRequest request) {
        if (programRepository.existsByNameIgnoreCase(request.programName())) {
            throw new IllegalArgumentException(
                    "Ya existe un programa académico registrado con el nombre: " + request.programName());
        }

        Program program = new Program();
        program.setName(request.programName());

        assignCoordinatorIfPresent(program, request.coordinatorId());

        Program savedProgram = programRepository.save(program);

        return mapToResponse(savedProgram);
    }

    @Override
    @Transactional
    public ProgramResponse updateProgram(UUID id, CreateProgramRequest request) {
        Program program = programRepository.findByIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se puede actualizar: El programa solicitado no existe."));

        if (!program.getName().equalsIgnoreCase(request.programName()) &&
                programRepository.existsByNameIgnoreCase(request.programName())) {
            throw new IllegalArgumentException(
                    "Ya existe un programa académico registrado con el nombre: " + request.programName());
        }
        program.setName(request.programName());

        assignCoordinatorIfPresent(program, request.coordinatorId());

        Program updatedProgram = programRepository.save(program);

        return mapToResponse(updatedProgram);
    }

    private ProgramResponse mapToResponse(Program program) {
        UUID coordinatorId = (program.getCoordinator() != null)
                ? program.getCoordinator().getIdentificator()
                : null;

        return new ProgramResponse(
                program.getIdentificator(),
                program.getName(),
                coordinatorId);
    }

    private void assignCoordinatorIfPresent(Program program, UUID coordinatorId) {
        if (program.getCoordinator() != null) {
            User oldCoordinator = program.getCoordinator();
            oldCoordinator.setProgram(null);
            userRepository.save(oldCoordinator);
        }

        if (coordinatorId != null) {
            User newCoordinator = userRepository.findByIdentificator(coordinatorId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("No se encontró el usuario con ID: " + coordinatorId));

            boolean isCoordinator = newCoordinator.getRoles().stream()
                    .anyMatch(role -> role.getName().equals(AppRole.COORDINATOR.name()));

            if (!isCoordinator) {
                throw new IllegalArgumentException("El usuario " + newCoordinator.getName()
                        + " no puede ser asignado porque no tiene el rol de COORDINADOR.");
            }

            if (newCoordinator.getProgram() != null && !newCoordinator.getProgram().equals(program)) {
                Program oldProgramOfNewCoordinator = newCoordinator.getProgram();
                oldProgramOfNewCoordinator.setCoordinator(null);
                programRepository.save(oldProgramOfNewCoordinator);
            }

            program.setCoordinator(newCoordinator);
            newCoordinator.setProgram(program);
            userRepository.save(newCoordinator);
        } else {
            program.setCoordinator(null);
        }
    }
}