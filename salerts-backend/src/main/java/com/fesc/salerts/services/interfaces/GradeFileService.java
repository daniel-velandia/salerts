package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.responses.BulkUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

public interface GradeFileService {
    byte[] generateGradeTemplate(UUID groupId, Integer noteNumber);
    BulkUploadResponse uploadGrades(UUID groupId, Integer noteNumber, MultipartFile file);
}