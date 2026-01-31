import { z } from "zod";

export const subjectSchema = z.object({
  code: z
    .string()
    .min(1, "El código es requerido")
    .max(20, "El código no debe exceder 20 caracteres"),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no debe exceder 100 caracteres"),
  credits: z
    .coerce.number()
    .min(1, "Debe tener al menos 1 crédito")
    .max(20, "No debe exceder 20 créditos")
    .int("Debe ser un número entero"),
  programId: z.string().min(1, "El programa es requerido"),
});
