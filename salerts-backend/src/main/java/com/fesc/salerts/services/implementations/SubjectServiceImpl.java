package com.fesc.salerts.services.implementations;

import com.fesc.salerts.domain.entities.academic.Program;
import com.fesc.salerts.domain.entities.academic.Subject;
import com.fesc.salerts.domain.entities.academic.SubjectProgram;
import com.fesc.salerts.domain.repositories.ProgramRepository;
import com.fesc.salerts.domain.repositories.SubjectProgramRepository;
import com.fesc.salerts.domain.repositories.SubjectRepository;
import com.fesc.salerts.dtos.requests.CreateSubjectRequest;
import com.fesc.salerts.dtos.responses.SubjectResponse;
import com.fesc.salerts.infrastructure.exceptions.ResourceNotFoundException;
import com.fesc.salerts.services.interfaces.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ProgramRepository programRepository;
    private final SubjectProgramRepository subjectProgramRepository;

    @Override
    @Transactional
    public SubjectResponse createSubject(CreateSubjectRequest request) {
        if (subjectRepository.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("Ya existe una materia registrada con el código: " + request.code());
        }

        Program program = programRepository.findByIdentificator(request.programId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el programa académico con el ID: " + request.programId()));

        Subject subject = new Subject();
        subject.setCode(request.code().toUpperCase().trim());
        subject.setName(request.name().trim());
        subject.setCredits(request.credits());

        Subject savedSubject = subjectRepository.save(subject);

        SubjectProgram subjectProgram = new SubjectProgram();
        subjectProgram.setProgram(program);
        subjectProgram.setSubject(savedSubject);

        SubjectProgram savedSubjectProgram = subjectProgramRepository.save(subjectProgram);

        return mapToResponse(savedSubjectProgram);
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(UUID id, CreateSubjectRequest request) {
        SubjectProgram subjectProgram = subjectProgramRepository.findBySubjectIdentificator(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La materia con ID " + id + " no existe o no está vinculada a un programa."));

        Subject subject = subjectProgram.getSubject();
        String newCode = request.code().toUpperCase().trim();

        if (!subject.getCode().equals(newCode) &&
                subjectRepository.existsByCodeIgnoreCase(newCode)) {
            throw new IllegalArgumentException(
                    "No se puede actualizar: El código " + newCode + " ya está asignado a otra materia.");
        }

        subject.setCode(newCode);
        subject.setName(request.name().trim());
        subject.setCredits(request.credits());

        subjectRepository.save(subject);
        return mapToResponse(subjectProgram);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects(String search, UUID programId) {

        String searchFilter = null;

        if (search != null && !search.trim().isEmpty()) {
            searchFilter = "%" + search.trim().toLowerCase() + "%";
        }

        List<SubjectProgram> relationships = subjectProgramRepository.findByFilters(searchFilter, programId);

        return relationships.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getSubject(UUID identificator) {
        SubjectProgram subjectProgram = subjectProgramRepository.findBySubjectIdentificator(identificator)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + identificator));

        return mapToResponse(subjectProgram);
    }

    private SubjectResponse mapToResponse(SubjectProgram sp) {
        return new SubjectResponse(
                sp.getSubject().getIdentificator(),
                sp.getSubject().getCode(),
                sp.getSubject().getName(),
                sp.getSubject().getCredits(),
                sp.getProgram().getIdentificator());
    }
}