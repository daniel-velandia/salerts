import { z } from "zod";

export const programSchema = z.object({
  programName: z.string().min(1, "El nombre del programa es obligatorio"),
  coordinatorId: z.string().min(1, "Debes seleccionar un coordinador"),
});
