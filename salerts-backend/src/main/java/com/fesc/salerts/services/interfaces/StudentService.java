package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.requests.CreateStudentRequest;
import com.fesc.salerts.dtos.requests.StudentFilter;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse;
import com.fesc.salerts.dtos.responses.StudentResponse;
import java.util.List;
import java.util.UUID;

public interface StudentService {
    StudentResponse createStudent(CreateStudentRequest request);
    List<StudentDashboardResponse> getAllStudents(StudentFilter filter);
    StudentResponse updateStudent(CreateStudentRequest request, UUID identificator);
    StudentResponse getStudentProfile(UUID identificator);
    void markStudentAlertsAsRead(UUID studentId);
}