import { AppForm, AppInput, AppSelect, AppSubmitButton } from "@/ui/components/common";
import { programSchema } from "@/domain/schemas/programSchema";
import type { CreateProgramPayload } from "@/domain/models/program/CreateProgramPayload";
import { Button } from "@/ui/components/shadcn/button";

interface ProgramFormProps {
  defaultValues: CreateProgramPayload;
  onSubmit: (data: CreateProgramPayload) => void;
  coordinatorOptions: any[];
  onCancel: () => void;
}

export function ProgramForm({ defaultValues, onSubmit, coordinatorOptions, onCancel }: ProgramFormProps) {

  return (
    <AppForm<CreateProgramPayload>
      schema={programSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <AppInput
        name="programName"
        label="Nombre del Programa *"
        placeholder="Ej. Ingeniería de Sistemas"
      />

      <AppSelect
        name="coordinatorId"
        label="Coordinador *"
        placeholder="Seleccionar coordinador"
        options={coordinatorOptions}
      />

      <div className="flex items-center gap-3 pt-4 w-full">
        <Button className="flex-1 cursor-pointer" type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <AppSubmitButton className="flex-1">
          Guardar
        </AppSubmitButton>
      </div>
    </AppForm>
  );
}
