package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.StaffFilter;
import com.fesc.salerts.dtos.requests.UserRequest;
import com.fesc.salerts.dtos.responses.StaffResponse;
import com.fesc.salerts.dtos.responses.UserResponse;
import com.fesc.salerts.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROFILES_WRITE_VALUE + "')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROFILES_WRITE_VALUE + "')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROFILES_WRITE_VALUE + "')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROFILES_WRITE_VALUE + "')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.PROFILES_WRITE_VALUE + "')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.TEACHERS_WRITE_VALUE + "', '"
            + AppPermission.Constants.COORDINATORS_WRITE_VALUE + "', '" + AppPermission.Constants.TEACHERS_READ_VALUE
            + "', '" + AppPermission.Constants.COORDINATORS_READ_VALUE + "')")
    public ResponseEntity<List<StaffResponse>> getStaff(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID programId,
            @RequestParam(required = false) String role) {
        StaffFilter filter = new StaffFilter(search, programId, role);
        return ResponseEntity.ok(userService.getStaff(filter));
    }
}