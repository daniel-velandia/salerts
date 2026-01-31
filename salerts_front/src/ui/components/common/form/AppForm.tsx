import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  type FieldValues,
  type UseFormProps,
  type SubmitHandler,
} from "react-hook-form";
import { ZodType } from "zod";

interface Props<T extends FieldValues> extends UseFormProps<T> {
  schema: ZodType<T, any, any>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

export const AppForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  ...props
}: Props<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues,
    ...props,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};
