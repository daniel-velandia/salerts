import z from "zod";

export const staffFilterSchema = z.object({
  search: z.string().optional(),
  programId: z.string().optional(),
  role: z.string().optional(),
});