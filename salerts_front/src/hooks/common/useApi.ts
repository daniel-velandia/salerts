import { useCallback, useEffect, useState } from "react";
import { handleError } from "@/domain/errors/normalizedError";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { ApiError } from "@/domain/errors/ApiError";

interface Options<P> {
  autoFetch: boolean;
  params: P;
}

interface Result<T, P> {
  loading: boolean;
  error: CustomError;
  data: Data<T>;
  call: (params: P) => void;
}

type Data<T> = T | null;
type CustomError = ApiError | null;

export const useApi = <T, P>(
  apiCall: (param: P) => ApiCall<T>,
  options?: Options<P>,
): Result<T, P> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<CustomError>(null);
  const [data, setData] = useState<Data<T>>(null);

  const call = useCallback(
    (param: P) => {
      const { call, controller } = apiCall(param);

      setLoading(true);
      setError(null);

      call
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          setError(handleError(err));
        })
        .finally(() => {
          setLoading(false);
        });

      return () => controller.abort();
    },
    [apiCall],
  );

  useEffect(() => {
    if (options?.autoFetch) return call(options?.params);
  }, [call, options?.autoFetch, options?.params]);

  return { loading: loading, error: error, data: data, call: call };
};
