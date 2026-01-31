package com.fesc.salerts.dtos.responses;

import java.util.UUID;

public record StudentResponse(
    UUID id,
    String name,
    String lastname,
    String nit,
    String cellPhone,
    String address,
    String email,
    String role,
    UUID progId,
    String progName
) {}
