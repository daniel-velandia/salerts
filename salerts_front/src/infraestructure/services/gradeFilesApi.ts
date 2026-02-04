import { apiGet, apiPostFormData, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { GradeFileUploadResponse } from "@/domain/models/files/GradeFileResponses";

export const uploadGradeFile = (
  groupId: string | number,
  noteNumber: number,
  file: File
): ApiCall<GradeFileUploadResponse> => {
  return createApiCall(async (signal) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiPostFormData<GradeFileUploadResponse>(
      `/api/grade-files/upload/${groupId}/${noteNumber}`,
      formData,
      { signal }
    );
  });
};

export const downloadGradeTemplate = (
  groupId: string | number,
  noteNumber: number
): ApiCall<Blob> => {
  return createApiCall(async (signal) => {
    const response = apiGet<Blob>(
      `/api/grade-files/template/${groupId}/${noteNumber}`,
      {
        signal,
        responseType: "blob",
      }
    );
    return response;
  });
};
