import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Field, FieldDescription } from "../../shadcn";

interface Props {
  children: ReactNode;
  description?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const AppSubmitButton = ({
  children,
  description,
  className,
  disabled,
}: Props) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Field className={className}>
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="shadow-sm hover:bg-red-700 cursor-pointer"
      >
        {isSubmitting ? "Cargando..." : children}
      </Button>
      {description && (
        <FieldDescription className="text-center">
          {description}
        </FieldDescription>
      )}
    </Field>
  );
};
