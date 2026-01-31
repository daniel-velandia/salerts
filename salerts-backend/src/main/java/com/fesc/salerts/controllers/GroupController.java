package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateGroupRequest;
import com.fesc.salerts.dtos.requests.UpdateGroupRequest;
import com.fesc.salerts.dtos.responses.GroupDetailResponse;
import com.fesc.salerts.services.interfaces.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.GROUPS_WRITE_VALUE + "')")
    public ResponseEntity<GroupDetailResponse> createGroup(@RequestBody @Valid CreateGroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.GROUPS_WRITE_VALUE + "')")
    public ResponseEntity<GroupDetailResponse> updateGroup(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateGroupRequest request) {
        return ResponseEntity.ok(groupService.updateGroup(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GROUPS_WRITE_VALUE + "', '"
            + AppPermission.Constants.GROUPS_READ_VALUE + "')")
    public ResponseEntity<List<GroupDetailResponse>> getGroups(
            @RequestParam(required = false) UUID periodId,
            @RequestParam(required = false) UUID teacherId,
            @RequestParam(required = false) UUID subjectId) {
        return ResponseEntity.ok(groupService.getGroups(periodId, teacherId, subjectId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + AppPermission.Constants.GROUPS_WRITE_VALUE + "', '"
            + AppPermission.Constants.GROUPS_READ_VALUE + "')")
    public ResponseEntity<GroupDetailResponse> getGroupDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupDetail(id));
    }
}