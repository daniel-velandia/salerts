package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateAcademicPeriodRequest;
import com.fesc.salerts.dtos.responses.AcademicPeriodResponse;
import com.fesc.salerts.services.interfaces.AcademicPeriodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/periods")
@RequiredArgsConstructor
public class AcademicPeriodController {

    private final AcademicPeriodService periodService;

    @GetMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_READ_VALUE + "')")
    public ResponseEntity<List<AcademicPeriodResponse>> getAllPeriods() {
        return ResponseEntity.ok(periodService.getAllPeriods());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<AcademicPeriodResponse> createPeriod(
            @RequestBody @Valid CreateAcademicPeriodRequest request) {
        return ResponseEntity.ok(periodService.createPeriod(request));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<AcademicPeriodResponse> activatePeriod(@PathVariable UUID id) {
        return ResponseEntity.ok(periodService.toggleActiveState(id));
    }
}