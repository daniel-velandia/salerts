package com.fesc.salerts.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import com.fesc.salerts.dtos.requests.CreateGroupRequest.CreateScheduleRequest; // Reutilizamos el DTO interno de horarios

public record UpdateGroupRequest(
    @NotNull(message = "El profesor es obligatorio")
    UUID teacherId,

    @NotBlank(message = "El nombre del grupo es obligatorio")
    String groupName,

    @NotEmpty(message = "Debe asignar al menos un horario")
    @Valid
    List<CreateScheduleRequest> schedules
) {}