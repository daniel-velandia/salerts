import z from "zod";

export const subjectFilterSchema = z.object({
  search: z.string().optional(),
  programId: z.string().optional(),
});

export type SubjectFilterFormValues = z.infer<typeof subjectFilterSchema>;

export const emptySubjectFilterFormValues: SubjectFilterFormValues = {
  search: "",
  programId: "ALL",
};
