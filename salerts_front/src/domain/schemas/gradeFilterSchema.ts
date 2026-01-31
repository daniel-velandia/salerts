import z from "zod";

export const gradeFilterSchema = z.object({
  groupId: z.string().optional(),
  teacherId: z.string().optional(),
});

export type GradeFilterFormValues = z.infer<typeof gradeFilterSchema>;
