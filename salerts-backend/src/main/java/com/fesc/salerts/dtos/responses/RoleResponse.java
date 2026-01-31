package com.fesc.salerts.dtos.responses;

import java.util.UUID;

public record RoleResponse(
    UUID id,
    String roleName
) {}
