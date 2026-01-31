import { apiGet, apiPost, apiPut, apiPatch, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { FullStudentData } from "@/domain/models/students/FullStudentData";
import type { StudentFilterParams } from "@/domain/models/students/StudentFilterParams";
import type { StudentFilterOptions } from "@/domain/models/students/StudentFilterOptions";
import type { CreateStudentPayload } from "@/domain/models/students/CreateStudentPayload";
import type { UpdateStudentParams } from "@/domain/models/students/UpdateStudentParams";
import type { StudentDetailResponse } from "@/domain/models/students/StudentDetailResponse";

export const getAllStudents = (
  params: StudentFilterParams,
): ApiCall<FullStudentData[]> => {
  return createApiCall((signal: AbortSignal) =>
    apiGet<FullStudentData[]>("/api/students", {
      params,
      signal,
    }),
  );
};

export const getStudentById = (id: string): ApiCall<StudentDetailResponse> => {
  return createApiCall(async (signal) =>
    apiGet<StudentDetailResponse>(`/api/students/${id}`, { signal }),
  );
};

export const createStudent = (params: CreateStudentPayload): ApiCall<void> => {
  return createApiCall(async (signal) => {
    return apiPost<void>("/api/students", params, { signal });
  });
};

export const updateStudent = ({
  id,
  data,
}: UpdateStudentParams): ApiCall<void> => {
  return createApiCall(async (signal) => {
    return apiPut<void>(`/api/students/${id}`, data, { signal });
  });
};

export const getStudentFilterOptions = (): ApiCall<StudentFilterOptions> => {
  return createApiCall((signal) =>
    apiGet<StudentFilterOptions>("/api/options/student-filters", { signal }),
  );
};


export const markAlertsAsRead = (studentId: string): ApiCall<void> => {
  return createApiCall(async (signal) =>
    apiPatch<void>(`/api/students/${studentId}/alerts/read`, {}, { signal })
  );
};
