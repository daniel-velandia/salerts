import { z } from "zod";

export const studentFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  lastname: z.string().min(1, { message: "El apellido es obligatorio" }),
  nit: z.string().min(1, { message: "El nit es obligatorio" }),
  email: z.email({ message: "Email inválido" }),
  address: z.string().min(1, { message: "La dirección es obligatorio" }),
  cellphone: z.string().min(1, { message: "El teléfono es obligatorio" }),
  programId: z.uuid({ message: "Debes seleccionar un programa" }),
});
