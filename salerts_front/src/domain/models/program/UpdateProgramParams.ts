import type { CreateProgramPayload } from "./CreateProgramPayload";

export interface UpdateProgramParams {
  id: string;
  data: CreateProgramPayload;
}
