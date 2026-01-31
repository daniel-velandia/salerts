package com.fesc.salerts.dtos.requests;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaveGradeRequest(
    @NotNull(message = "El ID de la matrícula es obligatorio")
    UUID enrollmentId,
    @NotNull(message = "El número de corte es obligatorio (1-4)")
    @Min(1) @Max(4)
    Integer termNumber,
    @NotNull(message = "La nota es obligatoria")
    @DecimalMin("0.0") @DecimalMax("5.0")
    BigDecimal value
) {}
