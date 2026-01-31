package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record UpdateCalendarDatesRequest(
    @NotNull(message = "La fecha de inicio es obligatoria")
    LocalDateTime startDate,

    @NotNull(message = "La fecha de fin es obligatoria")
    LocalDateTime endDate
) {}