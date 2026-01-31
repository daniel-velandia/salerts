package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateAcademicPeriodRequest(
    @NotBlank(message = "El nombre es obligatorio")
    String name,

    @NotNull(message = "La fecha de inicio es obligatoria")
    LocalDate initialDate,

    @NotNull(message = "La fecha de fin es obligatoria")
    LocalDate endDate,

    Boolean activeState
) {}