import { LoginForm } from "../components";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useLogin();
  const { isAuthenticated } = useAuthSession();

  if (isAuthenticated) {
    return <Navigate to="/students" replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={login} />
      </div>
    </div>
  );
};

export default LoginPage;
