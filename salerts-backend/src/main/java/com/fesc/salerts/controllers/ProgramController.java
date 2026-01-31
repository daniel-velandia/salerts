package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateProgramRequest;
import com.fesc.salerts.dtos.responses.ProgramResponse;
import com.fesc.salerts.services.interfaces.ProgramService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.PROGRAMS_READ_VALUE + "', '" + AppPermission.Constants.PROGRAMS_WRITE_VALUE + "' )") 
    public ResponseEntity<List<ProgramResponse>> getAllPrograms() {
        return ResponseEntity.ok(programService.getAllPrograms());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROGRAMS_WRITE_VALUE + "')")
    public ResponseEntity<ProgramResponse> createProgram(@Valid @RequestBody CreateProgramRequest request) {
        return ResponseEntity.ok(programService.createProgram(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROGRAMS_WRITE_VALUE + "')")
    public ResponseEntity<ProgramResponse> updateProgram(
            @PathVariable UUID id,
            @RequestBody @Valid CreateProgramRequest request
    ) {
        return ResponseEntity.ok(programService.updateProgram(id, request));
    }
}