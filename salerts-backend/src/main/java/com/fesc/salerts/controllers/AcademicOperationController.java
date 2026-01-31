package com.fesc.salerts.controllers;

import java.util.UUID;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.EnrollStudentRequest;
import com.fesc.salerts.dtos.requests.SaveGradeRequest;
import com.fesc.salerts.dtos.responses.ExcelExportResponse;
import com.fesc.salerts.dtos.responses.GroupGradesResponse;
import com.fesc.salerts.services.interfaces.AcademicOperationService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class AcademicOperationController {

    private final AcademicOperationService operationService;

    @PostMapping("/enroll")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.STUDENTS_WRITE_VALUE + "')")
    public ResponseEntity<String> enroll(@RequestBody @Valid EnrollStudentRequest request) {
        operationService.enrollStudent(request);
        return ResponseEntity.ok("Estudiante inscrito exitosamente");
    }

    @PutMapping("/grade")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.GRADES_WRITE_VALUE + "')")
    public ResponseEntity<String> saveGrade(@RequestBody @Valid SaveGradeRequest request) {
        operationService.saveGrade(request);
        return ResponseEntity.ok("Nota registrada y definitiva actualizada");
    }

    @GetMapping("/grades")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GRADES_READ_VALUE + "', '"
            + AppPermission.Constants.GRADES_WRITE_VALUE + "')")
    public ResponseEntity<GroupGradesResponse> getGroupGrades(
            @RequestParam UUID groupId,
            @RequestParam(required = false) UUID teacherId) {
        return ResponseEntity.ok(operationService.getGroupGrades(groupId, teacherId));
    }

    @GetMapping("/grades/export")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GRADES_READ_VALUE + "', '"
            + AppPermission.Constants.GRADES_WRITE_VALUE + "')")
    public ResponseEntity<Resource> exportGrades(@RequestParam UUID groupId) {
        ExcelExportResponse export = operationService.exportGradesToExcel(groupId);

        InputStreamResource resource = new InputStreamResource(export.stream());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + export.fileName())
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

    @DeleteMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.STUDENTS_WRITE_VALUE + "')")
    public ResponseEntity<String> unenroll(@PathVariable UUID enrollmentId) {
        operationService.unenrollStudent(enrollmentId);
        return ResponseEntity.ok("Estudiante desvinculado y registros eliminados");
    }
}
