import { passwordSchema, type PasswordFormValues } from "@/domain/schemas/userSchemas";
import { AppForm, AppInput, AppSubmitButton } from "@/ui/components/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/shadcn/card";

interface Props {
  onSubmit: (data: PasswordFormValues) => void;
  loading: boolean;
}

export const PasswordForm = ({ onSubmit, loading }: Props) => {
  const defaultValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>Asegúrate de usar una contraseña segura.</CardDescription>
      </CardHeader>
      <CardContent>
        <AppForm<PasswordFormValues>
          schema={passwordSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              name="currentPassword"
              label="Contraseña Actual"
              type="password"
              placeholder="Tu contraseña actual"
            />
            <AppInput
              name="newPassword"
              label="Nueva Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
            />
            <AppInput
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="Repite la nueva contraseña"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <AppSubmitButton className="w-full sm:w-auto" disabled={loading}>
              {loading ? "Cambiando..." : "Actualizar Contraseña"}
            </AppSubmitButton>
          </div>
        </AppForm>
      </CardContent>
    </Card>
  );
};
