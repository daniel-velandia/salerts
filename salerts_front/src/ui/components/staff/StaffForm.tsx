import { Card, CardContent } from "@/ui/components/shadcn/card";
import { AppForm, AppInput, AppSubmitButton } from "@/ui/components/common";
import { staffSchema, type StaffFormData } from "@/domain/schemas/staffSchema";
import { AppSelect } from "../common/form/AppSelect";
import type { Option } from "@/domain/models/Option";

interface Props {
  defaultValues: StaffFormData;
  onSubmit: (data: StaffFormData) => void;
  isEdit: boolean;
  roleOptions: Option[];
}

export const StaffForm = ({ 
  defaultValues,
  onSubmit,
  isEdit,
  roleOptions,
}: Props) => {

  return (
    <Card>
      <CardContent className="pt-6">
          
        <AppForm<StaffFormData>
          schema={staffSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppInput 
              name="name" 
              label="Nombre *" 
              placeholder="Juan" 
            />
      
            <AppInput 
              name="lastname" 
              label="Apellido *" 
              placeholder="Pérez" 
            />

            <AppInput 
              name="nit" 
              label="NIT (Cédula) *" 
              placeholder="123456789" 
            />

            <AppInput 
              name="email" 
              label="Email Institucional *" 
              type="email" 
              placeholder="usuario@fesc.edu.co" 
            />

            <AppInput 
              name="cellphone" 
              label="Celular *" 
              placeholder="3001234567" 
            />

            <AppInput 
              name="address" 
              label="Dirección *" 
              placeholder="Calle 1 # 2-3" 
            />

            <div className="md:col-span-2">
              <AppSelect
                name="role"
                label="Rol Académico *"
                placeholder="Seleccione un rol"
                options={roleOptions}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <AppSubmitButton className="w-full sm:w-auto">
              {isEdit ? 'Guardar Cambios' : 'Crear Registro'}
            </AppSubmitButton>
          </div>

        </AppForm>

      </CardContent>
    </Card>
  );
};