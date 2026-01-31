import { ApiError } from "@/domain/errors/ApiError";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { axiosInstance, setupInterceptors } from ".";

setupInterceptors(axiosInstance);

export interface ApiOptions extends AxiosRequestConfig {}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance(path, opts);
    return response.data;
  } catch (err: any) {
    if (axios.isCancel(err))
      throw new ApiError("La solicitud fue cancelada", 499, null);

    if (err instanceof ApiError) throw err;

    const status = err.response?.status;
    const data = err.response?.data;
    const msg = data?.message || err.message || "Error desconocido";

    throw new ApiError(msg, status, data);
  }
}

export const apiGet = <T>(path: string, opts?: ApiOptions) =>
  api<T>(path, { method: "GET", ...opts });

export const apiPost = <T>(path: string, body?: any, opts?: ApiOptions) =>
  api<T>(path, { method: "POST", data: body, ...opts });

export const apiPut = <T>(path: string, body?: any, opts?: ApiOptions) =>
  api<T>(path, { method: "PUT", data: body, ...opts });

export const apiPatch = <T>(path: string, body?: any, opts?: ApiOptions) =>
  api<T>(path, { method: "PATCH", data: body, ...opts });

export const apiDelete = <T>(path: string, opts?: ApiOptions) =>
  api<T>(path, { method: "DELETE", ...opts });
