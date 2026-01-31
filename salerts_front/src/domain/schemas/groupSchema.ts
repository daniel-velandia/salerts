import { z } from 'zod';

export const groupSchema = z.object({
  groupName: z.string().min(1, 'El nombre del grupo es requerido'),
  subjectId: z.string().min(1, 'La materia es requerida'),
  teacherId: z.string().min(1, 'El profesor es requerido'),
  periodId: z.string().min(1, 'El período es requerido'),
  studentIds: z.array(z.string()).optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
