package com.fesc.salerts.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CreateCalendarBatchRequest(
    @NotNull(message = "El ID del periodo es obligatorio")
    UUID periodId,

    @Valid
    @NotNull(message = "La lista de fechas es obligatoria")
    @Size(min = 4, max = 4, message = "Se deben configurar exactamente los 4 cortes académicos")
    List<CalendarDateConfig> configs
) {
    public record CalendarDateConfig(
        @NotNull(message = "El número de nota es obligatorio")
        Integer noteNumber,

        @NotNull(message = "Fecha inicio obligatoria")
        LocalDateTime startDate,

        @NotNull(message = "Fecha fin obligatoria")
        LocalDateTime endDate
    ) {}
}