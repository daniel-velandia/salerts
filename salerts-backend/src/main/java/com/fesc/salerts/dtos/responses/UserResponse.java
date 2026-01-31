package com.fesc.salerts.dtos.responses;

import java.util.Set;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String name,
    String lastname,
    String nit,
    String address,
    String cellPhone,
    String email,
    Set<String> roles
) {}
