export interface CreateProgramPayload {
  programName: string;
  coordinatorId: string;
}

export const emptyCreateProgramPayload: CreateProgramPayload = {
  programName: '',
  coordinatorId: '',
};