package com.fesc.salerts.dtos.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StudentDashboardResponse(
    StudentInfo studentInfo,
    SubjectInfo subjectInfo,
    AlertInfo alertInfo
) {
    public record StudentInfo(
        UUID id,
        String name,
        String lastname,
        String nit,
        String email,
        String phone,
        String address,
        String programName
    ) {}

    public record SubjectInfo(
        String currentSemester,
        BigDecimal overallAverage,
        List<SubjectDetail> subjects
    ) {}

    public record SubjectDetail(
        UUID enrollmentId,
        String subjectName,
        String subjectCode,
        Integer credits,
        String groupName,
        BigDecimal term1,
        BigDecimal term2,
        BigDecimal term3,
        BigDecimal term4,
        BigDecimal definitive
    ) {}

    public record AlertInfo(
        long unreadCount,
        List<AlertDetail> alerts
    ) {}

    public record AlertDetail(
        UUID id,
        String type,
        String description,
        LocalDateTime date,
        boolean viewed
    ) {}
}