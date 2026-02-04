package com.fesc.salerts.dto.response;

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