package com.fesc.salerts.dtos.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ActiveTermStatusResponse {
    private boolean isGradingEnabled;
    private Integer activeTermNumber;
    private LocalDateTime deadline;
    private String message;
}