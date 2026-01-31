import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "@/infraestructure/store/hooks";
import { loginSuccess, logout } from "@/infraestructure/store/authSlice";
import type { AuthenticatedUser } from "@/domain/models/auth/AuthenticatedUser";
import { localStorageAdapter } from "@/infraestructure/persistence/localStorageAdapter";

interface Result {
  isAuthenticated: boolean;
}

export const useAuthSession = (): Result => {
  const dispatch = useAppDispatch();

  const isReduxAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  const attemptRef = useRef(false);
  const token = localStorageAdapter.get<string>("token");
  let isValidSession = isReduxAuthenticated;

  if (!isReduxAuthenticated && token) {
    try {
      const user: AuthenticatedUser = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (user.exp && user.exp > currentTime) isValidSession = true;
    } catch (e) {
      isValidSession = false;
    }
  }

  useEffect(() => {
    if (!isReduxAuthenticated && token && !attemptRef.current) {
      attemptRef.current = true;

      try {
        const user: AuthenticatedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (user.exp && user.exp < currentTime)
          throw new Error("Token expirado");

        dispatch(loginSuccess(user));
      } catch (error) {
        localStorageAdapter.remove("token");
        dispatch(logout());
      }
    }
  }, [dispatch, isReduxAuthenticated, token]);

  return { isAuthenticated: isValidSession };
};
