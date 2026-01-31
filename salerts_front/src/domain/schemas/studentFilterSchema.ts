import z from "zod";

export const studentFilterSchema = z.object({
  search: z.string().optional(),
  programId: z.string().optional(),
  scheduleId: z.string().optional(),
  teacherId: z.string().optional(),
});

export type StudentFilterFormValues = z.infer<typeof studentFilterSchema>;

export const emptyStudentFilterFormValues: StudentFilterFormValues = {
  search: "",
  programId: "",
  scheduleId: "",
  teacherId: "",
};