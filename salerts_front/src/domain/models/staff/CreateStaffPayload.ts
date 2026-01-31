export interface CreateStaffPayload {
  name: string;
  lastname: string;
  nit: string;
  address: string;
  cellphone: string;
  email: string;
  password?: string;
  rolesName: string[];
}
