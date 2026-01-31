export interface Grade {
  id: string; // This might be enrollmentId or distinct, API uses enrollmentId for update
  enrollmentId: string;
  studentId: string;
  studentName: string;
  subjectId?: string; // Optional as it might come from context
  subjectName?: string;
  teacherId?: string;
  term1: number;
  term2: number;
  term3: number;
  term4: number; // This replaces 'exam' if term4 is the exam or just another term
  finalGrade: number; // Replaces score
  maxScore: number;
}

// Para la edición parcial
export type GradeEditableFields = Pick<
  Grade,
  "term1" | "term2" | "term3" | "term4"
>;

// Filtros
export interface GradeFiltersState {
  groupId: string;
  teacherId: string;
}
