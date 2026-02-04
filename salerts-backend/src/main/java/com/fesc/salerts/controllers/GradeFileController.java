package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.responses.BulkUploadResponse;
import com.fesc.salerts.services.interfaces.GradeFileService;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/grade-files")
@RequiredArgsConstructor
public class GradeFileController {

    private final GradeFileService gradeFileService;

    @GetMapping("/template/{groupId}/{noteNumber}")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GRADES_WRITE_VALUE + "')")
    public ResponseEntity<Resource> downloadTemplate(
            @PathVariable UUID groupId,
            @PathVariable Integer noteNumber) {

        byte[] excelBytes = gradeFileService.generateGradeTemplate(groupId, noteNumber);

        String filename = String.format("Notas_G%s_Corte%d.xlsx", groupId.toString().substring(0, 8), noteNumber);
        
        ByteArrayResource resource = new ByteArrayResource(excelBytes);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(excelBytes.length)
                .body(resource);
    }

    @PostMapping(value = "/upload/{groupId}/{noteNumber}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GRADES_WRITE_VALUE + "')")
    public ResponseEntity<BulkUploadResponse> uploadGrades(
            @PathVariable UUID groupId,
            @PathVariable Integer noteNumber,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(gradeFileService.uploadGrades(groupId, noteNumber, file));
    }
}