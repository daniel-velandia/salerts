import { emptyLogin, type Login } from "@/domain/models/auth/Login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
} from "./shadcn";
import { z } from "zod";
import type { SubmitHandler } from "react-hook-form";
import { AppForm, AppInput, AppSubmitButton } from "./common";

const loginSchema = z.object({
  email: z.email("Correo inválido").min(1, "El correo es obligatorio"),
  password: z.string().min(5, "La contraseña debe tener al menos 6 caracteres"),
});

interface Props {
  onSubmit: SubmitHandler<Login>;
}

export const LoginForm = ({ onSubmit }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-left">
          <CardTitle>Inicia sesión en tu cuenta</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AppForm<Login>
            schema={loginSchema}
            defaultValues={emptyLogin}
            onSubmit={onSubmit}
          >
            <FieldGroup>
              <AppInput
                name="email"
                label="Correo"
                type="email"
                placeholder="nombre@ejemplo.com"
              />

              <AppInput name="password" label="Contraseña" type="password" />

              <AppSubmitButton
                description={
                  <>
                    ¿No tienes cuenta?{" "}
                    <a href="#" className="underline">
                      Regístrate
                    </a>
                  </>
                }
              >
                Ingresar
              </AppSubmitButton>
            </FieldGroup>
          </AppForm>
        </CardContent>
      </Card>
    </div>
  );
};
