package com.fesc.salerts.controllers;

import com.fesc.salerts.dtos.responses.GlobalOptionsResponse;
import com.fesc.salerts.services.interfaces.OptionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionsController {

    private final OptionsService optionsService;

    @GetMapping("/all")
    public ResponseEntity<GlobalOptionsResponse> getAllOptions() {
        return ResponseEntity.ok(optionsService.getGlobalOptions());
    }
}