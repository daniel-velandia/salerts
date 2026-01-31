import { AppAlertDialog } from "@/ui/components/common/feedback/AppAlertDialog";
import { ProgramForm } from "./ProgramForm";
import type { CreateProgramPayload } from "@/domain/models/program/CreateProgramPayload";
import type { Option } from "@/domain/models/Option";

interface ProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProgramPayload) => void;
  defaultValues: CreateProgramPayload;
  coordinatorOptions: Option[];
}

export function ProgramDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  coordinatorOptions
}: ProgramDialogProps) {

  return (
    <AppAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={defaultValues.programName ? "Editar Programa" : "Nuevo Programa"} 
      hideFooter={true} 
    >
      <ProgramForm
        key={JSON.stringify(defaultValues)}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        coordinatorOptions={coordinatorOptions}
        onCancel={() => onOpenChange(false)}
      />
    </AppAlertDialog>
  );
}
