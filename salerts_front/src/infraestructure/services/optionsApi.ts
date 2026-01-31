import { apiGet, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";

export const getGlobalOptions = (): ApiCall<GlobalOptions> => {
  return createApiCall(
    async (signal) => {
      return await apiGet<GlobalOptions>("/api/options/all", { signal });
    }
  );
};
