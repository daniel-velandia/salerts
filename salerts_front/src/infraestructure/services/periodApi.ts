import { apiGet, apiPost, apiPatch } from "@/infraestructure/services/config/apiClient";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { Period } from "@/domain/models/Period";

export interface CreatePeriodPayload {
  name: string;
  initialDate: string;
  endDate: string;
  activeState: boolean;
}

export const getAllPeriods = (): ApiCall<Period[]> => {
  return {
    call: apiGet<Period[]>("/api/periods"),
    controller: new AbortController()
  };
};

export const createPeriod = (data: CreatePeriodPayload): ApiCall<Period> => {
  return {
    call: apiPost<Period>("/api/periods", data),
    controller: new AbortController()
  };
};

export const activatePeriod = (id: string): ApiCall<Period> => {
  return {
    call: apiPatch<Period>(`/api/periods/${id}/activate`, {}),
    controller: new AbortController()
  };
};
