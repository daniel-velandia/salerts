import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z.email("Email inválido"),
  nit: z.string().min(1, "El NIT es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  cellphone: z.string().min(10, "El celular debe tener al menos 10 dígitos").max(10, "El celular debe tener máximo 10 dígitos"),
  role: z.string().min(1, "Debe seleccionar un rol"),
});

export type StaffFormData = z.infer<typeof staffSchema>;

export const emptyStaff: StaffFormData = {
  name: "",
  lastname: "",
  email: "",
  nit: "",
  address: "",
  cellphone: "",
  role: "", 
};
