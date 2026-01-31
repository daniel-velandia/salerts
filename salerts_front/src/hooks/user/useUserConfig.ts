import { useEffect, useCallback } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import { getMyProfile, updateMyProfile, updateMyPassword } from "@/infraestructure/services/userConfigApi";
import type { UserProfile } from "@/domain/models/user/UserProfile";
import type { UpdateProfilePayload } from "@/domain/models/user/UpdateProfilePayload";
import type { UpdatePasswordPayload } from "@/domain/models/user/UpdatePasswordPayload";
import { toast } from "sonner";

export const useUserConfig = () => {
  const dispatch = useAppDispatch();

  const {
    data: profile,
    loading: loadingProfile,
    error: errorProfile,
    call: fetchProfileCall,
  } = useApi<UserProfile, void>(getMyProfile, { autoFetch: true, params: undefined });

  const {
    loading: updatingProfile,
    error: errorUpdateProfile,
    call: updateProfileCall,
  } = useApi<string, UpdateProfilePayload>(updateMyProfile, { autoFetch: false, params: {} as any });

  const {
    loading: updatingPassword,
    error: errorUpdatePassword,
    call: updatePasswordCall,
  } = useApi<string, UpdatePasswordPayload>(updateMyPassword, { autoFetch: false, params: {} as any });

  const fetchProfile = useCallback(() => fetchProfileCall(undefined), [fetchProfileCall]);

  useEffect(() => {
    dispatch(setLoading(loadingProfile || updatingProfile || updatingPassword));
  }, [loadingProfile, updatingProfile, updatingPassword, dispatch]);

  useEffect(() => {
    const error = errorProfile || errorUpdateProfile || errorUpdatePassword;
    if (error && error.status !== 499) {
      dispatch(setError(error));
    }
  }, [errorProfile, errorUpdateProfile, errorUpdatePassword, dispatch]);

  const updateProfile = async (data: UpdateProfilePayload) => {
    try {
      await updateProfileCall(data);
      toast.success("Perfil actualizado correctamente");
      fetchProfile();
      return true;
    } catch (e) {
      return false;
    }
  };

  const updatePassword = async (data: UpdatePasswordPayload) => {
    try {
      await updatePasswordCall(data);
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    profile,
    updateProfile,
    updatePassword,
    loading: loadingProfile || updatingProfile || updatingPassword,
  };
};
