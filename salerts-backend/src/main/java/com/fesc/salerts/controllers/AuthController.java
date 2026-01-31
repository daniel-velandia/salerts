package com.fesc.salerts.controllers;

import com.fesc.salerts.dtos.requests.LoginRequest;
import com.fesc.salerts.dtos.responses.AuthResponse;
import com.fesc.salerts.dtos.responses.PermissionResponse;
import com.fesc.salerts.services.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/my-permissions")
    public ResponseEntity<Set<PermissionResponse>> getMyPermissions() {
        return ResponseEntity.ok(authService.getMyPermissions());
    }
}