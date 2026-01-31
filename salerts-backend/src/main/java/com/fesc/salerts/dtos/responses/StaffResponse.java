package com.fesc.salerts.dtos.responses;

import java.util.UUID;

public record StaffResponse(
    UUID id,
    String name,
    String lastname,
    String email,
    String nit,
    String role,
    String programName
) {}