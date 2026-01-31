package com.fesc.salerts.dtos.responses;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record GroupDetailResponse(
    UUID id,
    String groupName,
    SubjectResponse subject,
    TeacherResponse teacher,
    String scheduleDescription,
    PeriodResponse period,
    List<ScheduleResponse> schedules,
    List<StudentRowResponse> students
) {
    public record SubjectResponse(
        UUID id,
        String name,
        String code
    ) {}

    public record TeacherResponse(
        UUID id,
        String fullName,
        String email
    ) {}

    public record ScheduleResponse(
        UUID id,
        DayOfWeek day,
        LocalTime startTime,
        LocalTime endTime
    ) {}

    public record PeriodResponse(
        UUID id,
        String name,
        Boolean active
    ) {}

    public record StudentRowResponse(
        UUID enrollmentId,
        String fullName,
        String email
    ) {}
}