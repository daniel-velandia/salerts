import { profileSchema, type ProfileFormValues } from "@/domain/schemas/userSchemas";
import { AppForm, AppInput, AppSubmitButton } from "@/ui/components/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/shadcn/card";
import type { UserProfile } from "@/domain/models/user/UserProfile";

interface Props {
  profile: UserProfile | null;
  onSubmit: (data: ProfileFormValues) => void;
  loading: boolean;
}

export const ProfileForm = ({ profile, onSubmit, loading }: Props) => {
  const defaultValues: ProfileFormValues = {
    name: profile?.name || "",
    lastname: profile?.lastname || "",
    cellphone: profile?.cellPhone || "",
    address: profile?.address || "",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Actualiza tu información de contacto básica.</CardDescription>
      </CardHeader>
      <CardContent>
        <AppForm<ProfileFormValues>
          schema={profileSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          key={JSON.stringify(defaultValues)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              name="name"
              label="Nombres"
              placeholder="Tus nombres"
            />
            <AppInput
              name="lastname"
              label="Apellidos"
              placeholder="Tus apellidos"
            />
            <AppInput
              name="cellphone"
              label="Celular"
              placeholder="Tu número de celular"
            />
            <AppInput
              name="address"
              label="Dirección"
              placeholder="Tu dirección"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <AppSubmitButton disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </AppSubmitButton>
          </div>
        </AppForm>
      </CardContent>
    </Card>
  );
};
