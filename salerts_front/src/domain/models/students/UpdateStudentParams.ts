import type { CreateStudentPayload } from "./CreateStudentPayload";

export interface UpdateStudentParams {
  id: string;
  data: CreateStudentPayload;
}