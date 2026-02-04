import { useFormContext, Controller } from "react-hook-form";
import { cn, Field, FieldError, FieldLabel, Input } from "../../shadcn";
import type { ReactNode } from "react";

interface Props {
  name: string;
  label?: string;
  type?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export const AppInput = ({
  name,
  label,
  type,
  min,
  max,
  placeholder,
  disabled,
  icon,
}: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <div className="relative">
            {icon}
            <Input
              id={name}
              type={type}
              min={min}
              max={max}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              aria-invalid={fieldState.invalid}
              className={cn(
                fieldState.invalid && "placeholder:text-destructive",
                icon && "pl-10",
              )}
            />
          </div>
          {fieldState.error && (
            <FieldError className="text-left w-full">
              {fieldState.error.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
};
