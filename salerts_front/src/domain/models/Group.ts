import type { Schedule } from './Schedule';

export interface Group {
  id: string;
  groupName: string;
  subjectName: string;
  teacherName: string;
  scheduleDescription: string;
  schedules: Schedule[];
  teacherId?: string;
  subjectId?: string;
  periodId?: string;
  studentIds?: string[];
  enrolledStudents?: { enrollmentId: string; studentId?: string; email: string }[];
}
