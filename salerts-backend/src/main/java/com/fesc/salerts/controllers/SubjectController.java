package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateSubjectRequest;
import com.fesc.salerts.dtos.responses.SubjectResponse;
import com.fesc.salerts.services.interfaces.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.SUBJECTS_WRITE_VALUE + "')")
    public ResponseEntity<SubjectResponse> createSubject(@RequestBody @Valid CreateSubjectRequest request) {
        return ResponseEntity.ok(subjectService.createSubject(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.SUBJECTS_WRITE_VALUE + "')") 
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable UUID id,
            @RequestBody @Valid CreateSubjectRequest request
    ) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.SUBJECTS_READ_VALUE + "', '" + AppPermission.Constants.SUBJECTS_WRITE_VALUE +  "')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID programId
    ) {
        return ResponseEntity.ok(subjectService.getAllSubjects(search, programId));
    }

    @GetMapping("/{identificator}")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.SUBJECTS_WRITE_VALUE + "', '" + AppPermission.Constants.SUBJECTS_READ_VALUE + "')")
    public ResponseEntity<SubjectResponse> getSubject(@PathVariable UUID identificator) {
        return ResponseEntity.ok(subjectService.getSubject(identificator));
    }
}