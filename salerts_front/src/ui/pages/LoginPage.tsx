import { LoginForm } from "@/ui/components/LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useLogin();
  const { isAuthenticated } = useAuthSession();

  if (isAuthenticated) {
    return <Navigate to="/students" replace />;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmit={login} />
      </div>
    </div>
  );
}
