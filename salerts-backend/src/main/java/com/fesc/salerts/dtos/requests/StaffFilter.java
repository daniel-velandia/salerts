package com.fesc.salerts.dtos.requests;

import java.util.UUID;

public record StaffFilter(
    String searchTerm,
    UUID programId,
    String roleName
) {}
