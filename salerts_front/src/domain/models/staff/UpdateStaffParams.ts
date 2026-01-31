import type { CreateStaffPayload } from "./CreateStaffPayload";

export interface UpdateStaffParams {
  id: string;
  data: CreateStaffPayload;
}