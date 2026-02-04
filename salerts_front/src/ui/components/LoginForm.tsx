import { cn } from "@/ui/components/shadcn";
import { Card, CardContent } from "@/ui/components/shadcn/card";
import { AppForm, AppInput, AppSubmitButton } from "./common";
import { z } from "zod";
import type { SubmitHandler } from "react-hook-form";
import type { Login } from "@/domain/models/auth/Login";

const loginSchema = z.object({
  email: z.email("Correo inválido").min(1, "El correo es obligatorio"),
  password: z.string().min(5, "La contraseña debe tener al menos 6 caracteres"),
});

interface Props {
  className?: string;
  onSubmit: SubmitHandler<Login>;
}

export function LoginForm({
  className,
  onSubmit,
  ...props
}: Props) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <AppForm<Login>
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            className="p-6 md:p-8 flex flex-col gap-6"
          >
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-muted-foreground text-balance">
                  Ingresa a tu cuenta de SalertS
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                <AppInput 
                  name="email" 
                  label="Email" 
                  type="email" 
                  placeholder="m@example.com" 
                />
                
                <AppInput 
                  name="password" 
                  label="Contraseña" 
                  type="password" 
                />
                
                <AppSubmitButton>
                   Ingresar
                </AppSubmitButton>
              </div>
          </AppForm>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/fesc_claro.jpg"
              alt="FESC Claro"
              className="absolute inset-0 h-full w-full object-cover dark:hidden"
            />
            <img
              src="/fesc_oscuro.jpg"
              alt="FESC Oscuro"
              className="absolute inset-0 h-full w-full object-cover hidden dark:block"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
