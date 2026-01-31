export interface Login {
  email: string;
  password: string;
}

export const emptyLogin: Login = { email: "", password: "" };
