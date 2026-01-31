import { useAppSelector } from "@/infraestructure/store/hooks";
import type { Permission } from "@/domain/models/auth/Permission";

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);

  const hasPermission = (permission: Permission): boolean => {
    if (!user)
      return true;
    else if (!user.roles)
      return false;

    // Check if user has the exact permission
    if (user.roles.includes(permission)) return true;

    // Logic: WRITE implies READ
    if (permission.endsWith("_READ")) {
      const writePermission = permission.replace("_READ", "_WRITE") as Permission;
      if (user.roles.includes(writePermission)) return true;
    }

    return false;
  };

  /**
   * Checks if user has permission to VIEW a module.
   * Logic: Either READ or WRITE permission allows viewing.
   */
  const canView = (permissionBase: string): boolean => {
      const readPerm = `${permissionBase}_READ` as Permission;
      const writePerm = `${permissionBase}_WRITE` as Permission;
      return hasPermission(readPerm) || hasPermission(writePerm);
  }

  return { hasPermission, canView };
};
