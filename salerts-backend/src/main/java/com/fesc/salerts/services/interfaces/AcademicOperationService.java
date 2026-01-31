package com.fesc.salerts.services.interfaces;

import java.util.UUID;

import com.fesc.salerts.dtos.requests.EnrollStudentRequest;
import com.fesc.salerts.dtos.requests.SaveGradeRequest;
import com.fesc.salerts.dtos.responses.ExcelExportResponse;
import com.fesc.salerts.dtos.responses.GroupGradesResponse;

public interface AcademicOperationService {
    void enrollStudent(EnrollStudentRequest request);
    void saveGrade(SaveGradeRequest request);
    GroupGradesResponse getGroupGrades(UUID groupId, UUID teacherId);
    ExcelExportResponse exportGradesToExcel(UUID groupId);
    void unenrollStudent(UUID enrollmentId);
}
