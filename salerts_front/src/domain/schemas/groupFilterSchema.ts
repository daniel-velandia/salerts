import z from "zod";

export const groupFilterSchema = z.object({
  search: z.string().optional(),
  periodId: z.string().optional(),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
});
