package com.fesc.salerts.services.interfaces;

import java.util.List;
import java.util.UUID;

import com.fesc.salerts.dtos.requests.CreateAcademicPeriodRequest;
import com.fesc.salerts.dtos.responses.AcademicPeriodResponse;

public interface AcademicPeriodService {
    List<AcademicPeriodResponse> getAllPeriods();
    AcademicPeriodResponse createPeriod(CreateAcademicPeriodRequest request);
    AcademicPeriodResponse toggleActiveState(UUID id);
}
