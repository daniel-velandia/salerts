package com.fesc.salerts.dtos.responses;

import java.util.UUID;

public record ProgramResponse(
    UUID id,
    String name,
    UUID coordinatorId
) {}
