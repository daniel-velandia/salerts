export interface CreateStudentPayload {
  name: string;
  lastname: string;
  nit: string;
  address: string;
  cellphone: string;
  email: string;
  programId: string;
}

export const emptyCreateStudentPayload: CreateStudentPayload = {
  name: "",
  lastname: "",
  nit: "",
  address: "",
  cellphone: "",
  email: "",
  programId: "",
};