import { Card, CardContent } from "@/ui/components/shadcn/card";
import { AppForm, AppInput, AppSubmitButton } from "@/ui/components/common";
import { studentFormSchema } from "@/domain/schemas/studentSchema";
import { AppSelect } from "../../common/form/AppSelect";
import type { Option } from "@/domain/models/Option";
import type { CreateStudentPayload } from "@/domain/models/students/CreateStudentPayload";

interface Props {
  defaultValues: CreateStudentPayload;
  programs: Option[];
  onSubmit: (data: CreateStudentPayload) => void;
  isEdit: boolean;
}

export const StudentForm = ({
  defaultValues,
  programs,
  onSubmit,
  isEdit,
}: Props) => {

  return (
    <Card>
      <CardContent className="pt-6">
        <AppForm<CreateStudentPayload>
          schema={studentFormSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppInput name="name" label="Nombre *" placeholder="Juan" />

            <AppInput name="lastname" label="Apellido *" placeholder="Pérez" />

            <AppInput name="nit" label="Nit *" placeholder="123456789" />

            <AppInput
              name="email"
              label="Email Institucional *"
              type="email"
              placeholder="estudiante@fesc.edu.co"
            />

            <AppInput
              name="cellphone"
              label="Teléfono *"
              placeholder="3005596256"
            />

            <AppInput
              name="address"
              label="Dirección *"
              placeholder="Calle 3, Av. 15"
            />

            <AppSelect
              name="programId"
              label="Programa Académico *"
              placeholder="Programa"
              options={programs}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <AppSubmitButton className="w-full sm:w-auto">
              {isEdit ? 'Guardar Cambios' : 'Crear Registro'}
            </AppSubmitButton>
          </div>
        </AppForm>
      </CardContent>
    </Card>
  );
};
