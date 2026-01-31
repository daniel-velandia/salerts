import type { ApiCall } from "@/domain/models/ApiCall";

export const createApiCall = <T>(
  requestCallback: (signal: AbortSignal) => Promise<T>
): ApiCall<T> => {
  const controller = new AbortController();

  return {
    call: requestCallback(controller.signal),
    controller: controller,
  };
};
