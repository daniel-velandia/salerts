package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.responses.BulkUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface GradeFileService {
    Resource generateGradeTemplate(Long groupId, Integer noteNumber);
    BulkUploadResponse uploadGrades(Long groupId, Integer noteNumber, MultipartFile file);
}