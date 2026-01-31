package com.fesc.salerts.services.interfaces;

import java.util.List;

import com.fesc.salerts.dtos.responses.RoleResponse;

public interface RoleService {
    List<RoleResponse> getAllRoles();
}
