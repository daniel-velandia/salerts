package com.fesc.salerts.dtos.responses;

import java.io.ByteArrayInputStream;

public record ExcelExportResponse(
    ByteArrayInputStream stream,
    String fileName
) {}