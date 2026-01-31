import { ApiError } from "./ApiError";

export function handleError(err: unknown): ApiError {
  let error: ApiError;

  if (err instanceof ApiError) error = err;
  else if (err instanceof Error) error = new ApiError(err.message, 0, null);
  else error = new ApiError("Ha ocurrido un error inesperado", 0, null);

  return error;
}
