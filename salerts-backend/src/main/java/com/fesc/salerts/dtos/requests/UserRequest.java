package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

public record UserRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotBlank(message = "El apellido es obligatorio")
    String lastname,

    @NotBlank(message = "El número de identificación es obligatorio")
    String nit,

    String address,

    @NotBlank(message = "El número de celular es obligatorio")
    String cellphone,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "la contraseña es obligatoria")
    @Length(min = 8)
    String password,

    @NotEmpty(message = "Tiene que tener por lo menos un rol")
    Set<String> rolesName
) {}
