package com.fesc.salerts.dtos.responses;

import java.time.LocalDate;
import java.util.UUID;

public record AcademicPeriodResponse(
    UUID id,
    String name,
    LocalDate initialDate,
    LocalDate endDate,
    Boolean activeState
) {}