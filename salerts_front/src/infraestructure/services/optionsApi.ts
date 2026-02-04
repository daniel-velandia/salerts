import { apiGet, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";
import type { ActiveStatusResponse } from "@/domain/models/files/GradeFileResponses";

export const getGlobalOptions = (): ApiCall<GlobalOptions> => {
  return createApiCall(
    async (signal) => {
      return await apiGet<GlobalOptions>("/api/options/all", { signal });
    }
  );
};

export const getActiveTermStatus = (groupId: string | number): ApiCall<ActiveStatusResponse> => {
  return createApiCall(
    async (signal) => {
      return apiGet<ActiveStatusResponse>(`/api/options/active-status/${groupId}`, { signal });
    }
  );
};
