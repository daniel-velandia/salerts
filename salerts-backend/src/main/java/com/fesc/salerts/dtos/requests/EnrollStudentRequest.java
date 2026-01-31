package com.fesc.salerts.dtos.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record EnrollStudentRequest(
    @NotNull(message = "El ID del grupo es obligatorio")
    UUID groupId,
    @NotNull(message = "El ID del estudiante es obligatorio")
    UUID studentId
) {}
