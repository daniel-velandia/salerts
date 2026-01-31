package com.fesc.salerts.dtos.responses;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private String message;
    private int status;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> errors;
}