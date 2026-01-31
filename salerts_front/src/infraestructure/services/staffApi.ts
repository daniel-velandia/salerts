import type { ApiCall } from "@/domain/models/ApiCall";
import { apiGet, apiPost, apiPut, createApiCall } from "./config";
import type { StaffResponse } from "@/domain/models/staff/StaffResponse";
import type { StaffFilterParams } from "@/domain/models/staff/StaffFilterParams";
import type { StaffDetailResponse } from "@/domain/models/staff/StaffDetailResponse";
import type { CreateStaffPayload } from "@/domain/models/staff/CreateStaffPayload";
import type { UpdateStaffParams } from "@/domain/models/staff/UpdateStaffParams";

export const getAllStaff = (
  params?: StaffFilterParams,
): ApiCall<StaffResponse[]> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiGet<StaffResponse[]>("/api/users/staff", {
      signal,
      params,
    });
  });
};

export const getStaffById = (id: string): ApiCall<StaffDetailResponse> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiGet<StaffDetailResponse>(`/api/users/${id}`, { signal });
  });
};

export const createStaff = (data: CreateStaffPayload): ApiCall<void> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiPost<void>(`/api/users`, data, { signal });
  });
};

export const updateStaff = ({ id, data }: UpdateStaffParams): ApiCall<void> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiPut<void>(`/api/users/${id}`, data, { signal });
  });
};