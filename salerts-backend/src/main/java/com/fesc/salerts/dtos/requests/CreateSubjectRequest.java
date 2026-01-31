package com.fesc.salerts.dtos.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateSubjectRequest(
    @NotBlank(message = "El código es obligatorio")
    String code,

    @NotBlank(message = "El nombre es obligatorio")
    String name,

    @NotNull(message = "Los créditos son obligatorios")
    @Positive(message = "Los créditos deben ser un número positivo")
    Integer credits,

    @NotNull(message = "La materia tiene que estar asociada a un programa")
    UUID programId
) {}