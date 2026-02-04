package com.fesc.salerts.dtos.responses;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BulkUploadResponse {
    private int rowsProcessed;
    private int gradesSaved;
    private int errorsCount;
    private List<String> errorDetails;
}
