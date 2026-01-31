import type { Permission } from "./Permission";

export interface AuthenticatedUser {
  sub: string;
  roles: Permission[];
  exp: number;
}
