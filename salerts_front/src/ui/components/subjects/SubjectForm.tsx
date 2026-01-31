import {
  AppForm,
  AppInput,
  AppSelect,
  AppSubmitButton,
} from "@/ui/components/common";
import { subjectSchema } from "@/domain/schemas/subjectSchema";
import { Card, CardContent } from "@/ui/components/shadcn/card";
import type { Option } from "@/domain/models/Option";
import type { CreateSubjectPayload } from "@/domain/models/subject/CreateSubjectPayload";

interface SubjectFormProps {
  onSubmit: (data: CreateSubjectPayload) => void;
  defaultValues: CreateSubjectPayload;
  programs: Option[];
  isEdit: boolean;
}

export function SubjectForm({ onSubmit, defaultValues, programs, isEdit }: SubjectFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <AppForm<CreateSubjectPayload>
          schema={subjectSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput 
                name="name" 
                label="Nombre de la Materia *" 
                placeholder="Ej. Cálculo Diferencial" 
            />
            <AppInput 
                name="code" 
                label="Código *" 
                placeholder="Ej. MATH101" 
            />
            <AppInput 
                name="credits" 
                label="Créditos *" 
                type="number"
                placeholder="Ej. 3" 
            />
            <AppSelect
                name="programId"
                label="Programa Académico *"
                placeholder="Seleccione un programa"
                options={programs}
            />
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
}
