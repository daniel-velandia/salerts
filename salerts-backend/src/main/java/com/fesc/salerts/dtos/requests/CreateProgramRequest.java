package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CreateProgramRequest(
    @NotBlank(message = "El nombre del programa es obligatorio")
    @JsonProperty("programName")
    String programName,
    @JsonProperty("coordinatorId")
    UUID coordinatorId
) {}