package com.fesc.salerts.controllers;

import com.fesc.salerts.domain.enums.AppPermission;
import com.fesc.salerts.dtos.requests.CreateCalendarBatchRequest;
import com.fesc.salerts.dtos.requests.CreateCalendarConfigRequest;
import com.fesc.salerts.dtos.requests.UpdateCalendarDatesRequest;
import com.fesc.salerts.dtos.responses.CalendarConfigResponse;
import com.fesc.salerts.services.interfaces.CalendarConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar-configs")
@RequiredArgsConstructor
public class CalendarConfigController {

    private final CalendarConfigService calendarConfigService;

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<List<CalendarConfigResponse>> createBatchConfig(
            @Valid @RequestBody CreateCalendarBatchRequest request) {
        return ResponseEntity.ok(calendarConfigService.createBatchCalendarConfig(request));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<CalendarConfigResponse> createCalendarConfig(
            @Valid @RequestBody CreateCalendarConfigRequest request) {
        return ResponseEntity.ok(calendarConfigService.createCalendarConfig(request));
    }

    @GetMapping("/period/{periodId}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<List<CalendarConfigResponse>> getByPeriod(@PathVariable UUID periodId) {
        return ResponseEntity.ok(calendarConfigService.getConfigsByPeriod(periodId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermission.Constants.CONFIGURATION_WRITE_VALUE + "')")
    public ResponseEntity<CalendarConfigResponse> updateDates(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCalendarDatesRequest request) {
        return ResponseEntity.ok(calendarConfigService.updateDates(id, request.startDate(), request.endDate()));
    }
}