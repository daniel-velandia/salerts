import { apiGet, apiPost, apiPut, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { Program } from "@/domain/models/program/Program";
import type { CreateProgramPayload } from "@/domain/models/program/CreateProgramPayload";
import type { UpdateProgramParams } from "@/domain/models/program/UpdateProgramParams";

export const getAllPrograms = (): ApiCall<Program[]> => {
  return createApiCall(
    async (signal) =>
      apiGet<Program[]>("/api/programs", { signal })
  );
};

export const createProgram = (data: CreateProgramPayload): ApiCall<void> => {
  return createApiCall(
    async (signal) =>
      apiPost<void>("/api/programs", data, { signal })
  );
};

export const updateProgram = ({ id, data }: UpdateProgramParams): ApiCall<void> => {
  return createApiCall(
    async (signal) =>
      apiPut<void>(`/api/programs/${id}`, data, { signal })
  );
};
