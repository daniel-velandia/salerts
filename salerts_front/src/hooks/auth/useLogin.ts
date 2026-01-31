import { useEffect } from "react";
import { useApi } from "../common/useApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "@/infraestructure/store/authSlice";
import type { AuthenticatedUser } from "@/domain/models/auth/AuthenticatedUser";
import { login } from "@/infraestructure/services/authApi";
import type { Login } from "@/domain/models/auth/Login";
import type { Token } from "@/domain/models/auth/Token";
import { localStorageAdapter } from "@/infraestructure/persistence/localStorageAdapter";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { ApiError } from "@/domain/errors/ApiError";

export interface Result {
  login: (param: Login) => void;
}

export const useLogin = (): Result => {
  const { loading, error, data, call } = useApi<Token, Login>(login);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    dispatch(setLoading(loading));
    dispatch(setError(error));
  }, [loading, error, dispatch]);

  useEffect(() => {
    if (!data?.token) return;

    try {
      localStorageAdapter.set<string>("token", data?.token);
      const user: AuthenticatedUser = jwtDecode(data?.token);
      dispatch(loginSuccess(user));
      navigation("/students");
    } catch (err: unknown) {
      dispatch(setError(new ApiError("Error al procesar el token", 0, null)));
    }
  }, [data, dispatch]);

  return { login: call };
};
