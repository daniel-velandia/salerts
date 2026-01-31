package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.requests.LoginRequest;
import com.fesc.salerts.dtos.responses.AuthResponse;
import com.fesc.salerts.dtos.responses.PermissionResponse;
import java.util.Set;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    Set<PermissionResponse> getMyPermissions();
}