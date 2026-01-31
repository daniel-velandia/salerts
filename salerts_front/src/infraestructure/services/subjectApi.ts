import { apiGet, apiPost, apiPut, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { Subject } from "@/domain/models/subject/Subject";
import type { CreateSubjectPayload } from "@/domain/models/subject/CreateSubjectPayload";
import type { UpdateSubjectParams } from "@/domain/models/subject/UpdateSubjectParams";
import type { SubjectFilterParams } from "@/domain/models/subject/SubjectFilterParams";

export const getAllSubjects = (
  params?: SubjectFilterParams,
): ApiCall<Subject[]> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiGet<Subject[]>("/api/subjects", {
      signal,
      params,
    });
  });
};

export const getSubjectById = (id: string): ApiCall<Subject> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiGet<Subject>(`/api/subjects/${id}`, { signal });
  });
};

export const createSubject = (data: CreateSubjectPayload): ApiCall<void> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiPost<void>("/api/subjects", data, { signal });
  });
};

export const updateSubject = ({ id, data }: UpdateSubjectParams): ApiCall<void> => {
  return createApiCall(async (signal: AbortSignal) => {
    return apiPut<void>(`/api/subjects/${id}`, data, { signal });
  });
};
