package com.fesc.salerts.dtos.requests;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStudentRequest(
    @NotBlank(message = "El nombre es obligatorio")
    String name,

    @NotBlank(message = "El apellido es obligatorio")
    String lastname,

    @NotBlank(message = "El número de identificación es obligatorio")
    String nit,

    String address,

    @NotBlank(message = "El número de celular es obligatorio")
    String cellphone,

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un email válido")
    String email,

    @NotNull(message = "El estudiante debe estar asociado a un programa")
    UUID programId
) {}