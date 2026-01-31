package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record CreateCalendarConfigRequest(
    @NotNull(message = "El periodo es obligatorio")
    UUID periodId,

    @NotNull(message = "El número de corte es obligatorio")
    @Min(value = 1, message = "El corte mínimo es 1")
    @Max(value = 4, message = "El corte máximo es 4")
    Integer noteNumber,

    @NotNull(message = "Fecha de inicio obligatoria")
    LocalDateTime startDate,

    @NotNull(message = "Fecha de fin obligatoria")
    LocalDateTime endDate
) {}