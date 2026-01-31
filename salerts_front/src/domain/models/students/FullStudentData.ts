import type { AcademicSummary } from "../academic/AcademicSummary";
import type { AlertSummary } from "../alerts/AlertSummary";
import type { Student } from "./Student";

export interface FullStudentData {
  studentInfo: Student;
  subjectInfo: AcademicSummary;
  alertInfo: AlertSummary;
}
