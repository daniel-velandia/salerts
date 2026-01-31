import type { EnrolledSubject } from "./EnrolledSubject";

export interface AcademicSummary {
  currentSemester: string;
  overallAverage: number;
  subjects: EnrolledSubject[];
}
