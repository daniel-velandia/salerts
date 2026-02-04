package com.fesc.salerts.services.interfaces;

import com.fesc.salerts.dtos.requests.CreateCalendarBatchRequest;
import com.fesc.salerts.dtos.requests.CreateCalendarConfigRequest;
import com.fesc.salerts.dtos.responses.ActiveTermStatusResponse;
import com.fesc.salerts.dtos.responses.CalendarConfigResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CalendarConfigService {
    List<CalendarConfigResponse> createBatchCalendarConfig(CreateCalendarBatchRequest request);
    CalendarConfigResponse createCalendarConfig(CreateCalendarConfigRequest request);
    List<CalendarConfigResponse> getConfigsByPeriod(UUID periodId);
    CalendarConfigResponse updateDates(UUID id, LocalDateTime start, LocalDateTime end);
    ActiveTermStatusResponse getActiveTermStatus(UUID groupId);
}