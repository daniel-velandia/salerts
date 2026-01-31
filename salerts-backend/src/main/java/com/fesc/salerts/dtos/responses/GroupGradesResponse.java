package com.fesc.salerts.dtos.responses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record GroupGradesResponse(
        UUID groupId,
        String groupName,
        SubjectInfo subject,
        TeacherInfo teacher,
        PeriodInfo period,
        List<StudentRow> students
) {
    public record SubjectInfo(UUID id, String code, String name) {}
    public record TeacherInfo(UUID id, String name, String lastname) {}
    public record PeriodInfo(UUID id, String name) {}

    public record StudentInfo(UUID id, String name, String lastname, String email) {}

    public record StudentRow(
            UUID enrollmentId,
            StudentInfo student,
            BigDecimal term1,
            BigDecimal term2,
            BigDecimal term3,
            BigDecimal term4,
            BigDecimal finalGrade
    ) {}
}
