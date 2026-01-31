package com.fesc.salerts.dtos.responses;

import java.util.UUID;

public record SubjectResponse(
    UUID id,
    String code,
    String name,
    Integer credits,
    UUID programId
) {}