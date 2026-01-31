import { localStorageAdapter } from "@/infraestructure/persistence/localStorageAdapter";
import { logout } from "@/infraestructure/store/authSlice";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface Result {
  logout: () => void;
}

export const useLogout = (): Result => {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  const run = useCallback(() => {
    localStorageAdapter.remove("token");
    dispatch(logout());
    navigation("/", { replace: true });
  }, []);

  return { logout: run };
};
