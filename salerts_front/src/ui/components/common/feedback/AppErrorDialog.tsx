import { useErrorNavigation } from "@/hooks/feeedback/useErrorNavigation";
import type { UiError } from "@/infraestructure/store/uiSlice";
import { AppAlertDialog } from "@/ui/components/common/feedback/AppAlertDialog";

interface Props {
  error: UiError | null;
}

export const AppErrorDialog = ({ error }: Props) => {
  const { handleConfirm } = useErrorNavigation(error);

  if (!error) return null;

  return (
    <AppAlertDialog
      open={!!error}
      onOpenChange={(isOpen) => !isOpen && handleConfirm()}
      title={error.isFatalError ? "Error Crítico" : "Atención"}
      description={error.message || "Ha ocurrido un error inesperado."}
      actionText={error.isFatalError ? "Volver" : "Entendido"}
      onAction={handleConfirm}
      hideCancel={true}
    />
  );
};
