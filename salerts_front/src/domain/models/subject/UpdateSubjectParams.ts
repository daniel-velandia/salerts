import type { CreateSubjectPayload } from "./CreateSubjectPayload";

export interface UpdateSubjectParams {
  id: string;
  data: CreateSubjectPayload;
}
