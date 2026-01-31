package com.fesc.salerts.dtos.responses;

import java.time.LocalDateTime;
import java.util.UUID;

public record CalendarConfigResponse(
    UUID id,
    Integer noteNumber,
    LocalDateTime startDate,
    LocalDateTime endDate,
    UUID periodId,
    String periodName
) {}