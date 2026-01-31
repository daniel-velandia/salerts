package com.fesc.salerts.services.interfaces;

import java.util.List;
import java.util.UUID;

import com.fesc.salerts.dtos.requests.CreateProgramRequest;
import com.fesc.salerts.dtos.responses.ProgramResponse;

public interface ProgramService {
    List<ProgramResponse> getAllPrograms();
    ProgramResponse createProgram(CreateProgramRequest request);
    ProgramResponse updateProgram(UUID id, CreateProgramRequest request);
}
