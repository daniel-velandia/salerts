package com.fesc.salerts.controllers;

import com.fesc.salerts.dtos.requests.ChangePasswordRequest;
import com.fesc.salerts.dtos.requests.UpdateProfileRequest;
import com.fesc.salerts.dtos.responses.UserResponse;
import com.fesc.salerts.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/my-config")
@RequiredArgsConstructor
public class UserConfigController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        userService.updateMyProfile(authentication.getName(), request);
        return ResponseEntity.ok("Perfil actualizado exitosamente");
    }

    @PatchMapping("/password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getMyProfile(authentication.getName()));
    }
}
