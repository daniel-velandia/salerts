package com.fesc.salerts.dtos.requests;

import java.time.DayOfWeek;
import java.util.UUID;

public record StudentFilter(
    String searchTerm,
    UUID programId,
    UUID subjectId,
    UUID groupScheduleId,
    DayOfWeek dayOfWeek,
    UUID teacherId
) {}