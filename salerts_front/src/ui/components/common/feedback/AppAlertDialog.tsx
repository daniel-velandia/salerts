import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/components/shadcn";
import type { ReactNode } from "react";

interface AppAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | ReactNode;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  hideCancel?: boolean;
  children?: ReactNode;
  hideFooter?: boolean;
}

export function AppAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancelar",
  actionText = "Continuar",
  onAction,
  onCancel,
  variant = "default",
  hideCancel = false,
  children,
  hideFooter = false,
}: AppAlertDialogProps) {
  const handleAction = () => {
    onAction?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {children}
        </AlertDialogHeader>
        {!hideFooter && (
          <AlertDialogFooter>
            {!hideCancel && (
              <AlertDialogCancel onClick={handleCancel}>
                {cancelText}
              </AlertDialogCancel>
            )}

            <AlertDialogAction
              onClick={handleAction}
              className={
                variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
