import type { Token } from "@/domain/models/auth/Token";
import { apiPost, createApiCall } from "./config";
import type { Login } from "@/domain/models/auth/Login";
import type { ApiCall } from "@/domain/models/ApiCall";

export const login = (login: Login): ApiCall<Token> => {
  return createApiCall((signal: AbortSignal) =>
    apiPost<Token>("/api/auth/login", login, { signal: signal }),
  );
};
