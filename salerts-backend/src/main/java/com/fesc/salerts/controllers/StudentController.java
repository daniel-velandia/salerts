package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateStudentRequest;
import com.fesc.salerts.dtos.requests.StudentFilter;
import com.fesc.salerts.dtos.responses.StudentDashboardResponse;
import com.fesc.salerts.dtos.responses.StudentResponse;
import com.fesc.salerts.services.interfaces.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.STUDENTS_WRITE_VALUE + "')")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return ResponseEntity.ok(studentService.createStudent(request));
    }

    @PutMapping("/{identificator}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.STUDENTS_WRITE_VALUE + "')")
    public ResponseEntity<StudentResponse> updateStudent(@Valid @RequestBody CreateStudentRequest request, @PathVariable UUID identificator) {
        return ResponseEntity.ok(studentService.updateStudent(request, identificator));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.STUDENTS_READ_VALUE + "', '" + AppPermission.Constants.STUDENTS_WRITE_VALUE +"')") 
    public ResponseEntity<List<StudentDashboardResponse>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID programId,
            @RequestParam(required = false) UUID subjectId,
            @RequestParam(required = false) UUID scheduleId,
            @RequestParam(required = false) DayOfWeek day,
            @RequestParam(required = false) UUID teacherId
    ) {
        StudentFilter filter = new StudentFilter(search, programId, subjectId, scheduleId, day, teacherId);
        
        return ResponseEntity.ok(studentService.getAllStudents(filter));
    }

    @GetMapping("/{identificator}")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.STUDENTS_READ_VALUE + "', '" + AppPermission.Constants.STUDENTS_WRITE_VALUE + "')")
    public ResponseEntity<StudentResponse> getStudentProfile(@PathVariable UUID identificator) {
        return ResponseEntity.ok(studentService.getStudentProfile(identificator));
    }

    @PatchMapping("/{identificator}/alerts/read")
    public ResponseEntity<Void> markAlertsAsRead(@PathVariable UUID identificator) {
        studentService.markStudentAlertsAsRead(identificator);
        return ResponseEntity.noContent().build();
    }
}