import { apiGet, apiPost, apiPut } from "@/infraestructure/services/config/apiClient";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { CalendarConfig } from "@/domain/models/CalendarConfig";

export interface CalendarConfigInput {
  noteNumber: number;
  startDate: string;
  endDate: string;
}

export interface CreateCalendarConfigsPayload {
  periodId: string;
  noteNumber: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCalendarConfigPayload {
  startDate: string;
  endDate: string;
}

export const getConfigsByPeriod = (periodId: string): ApiCall<CalendarConfig[]> => {
  return {
    call: apiGet<CalendarConfig[]>(`/api/calendar-configs/period/${periodId}`),
    controller: new AbortController()
  };
};

export const createCalendarConfigs = (data: CreateCalendarConfigsPayload): ApiCall<CalendarConfig[]> => {
  return {
    call: apiPost<CalendarConfig[]>("/api/calendar-configs/create", data),
    controller: new AbortController()
  };
};

export const updateCalendarConfig = (id: string, data: UpdateCalendarConfigPayload): ApiCall<CalendarConfig> => {
  return {
    call: apiPut<CalendarConfig>(`/api/calendar-configs/${id}`, data),
    controller: new AbortController()
  };
};
