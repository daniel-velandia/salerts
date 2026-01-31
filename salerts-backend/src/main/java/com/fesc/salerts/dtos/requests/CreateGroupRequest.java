package com.fesc.salerts.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public record CreateGroupRequest(
    @NotNull(message = "La materia es obligatoria")
    UUID subjectId,

    @NotNull(message = "El profesor es obligatorio")
    UUID teacherId,

    @NotNull(message = "El periodo académico es obligatorio")
    UUID periodId,

    @NotBlank(message = "El nombre del grupo es obligatorio")
    String groupName,

    @NotEmpty(message = "Debe asignar al menos un horario")
    @Valid
    List<CreateScheduleRequest> schedules
) {
    public record CreateScheduleRequest(
        @NotNull(message = "El día es obligatorio")
        DayOfWeek dayOfWeek,

        @NotNull(message = "Hora inicio obligatoria")
        @JsonFormat(pattern = "HH:mm:ss")
        LocalTime startTime,

        @NotNull(message = "Hora fin obligatoria")
        @JsonFormat(pattern = "HH:mm:ss")
        LocalTime endTime
    ) {}
}