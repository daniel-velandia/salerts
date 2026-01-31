package com.fesc.salerts.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank 
    String name,
    @NotBlank 
    String lastname,
    @Size(min = 10, max = 10) 
    String cellphone,
    String address
) {}
