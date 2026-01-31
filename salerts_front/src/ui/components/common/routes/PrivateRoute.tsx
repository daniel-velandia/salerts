import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuthSession();
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />;
};
