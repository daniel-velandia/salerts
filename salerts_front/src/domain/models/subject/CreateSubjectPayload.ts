export interface CreateSubjectPayload {
  code: string;
  name: string;
  credits: number;
  programId: string;
}

export const emptyCreateSubjectPayload: CreateSubjectPayload = {
  code: "",
  name: "",
  credits: 0,
  programId: "",
};
