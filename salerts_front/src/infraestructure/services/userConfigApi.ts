import { apiGet, apiPut, apiPatch, createApiCall } from "./config";
import type { UserProfile } from "@/domain/models/user/UserProfile";
import type { UpdateProfilePayload } from "@/domain/models/user/UpdateProfilePayload";
import type { UpdatePasswordPayload } from "@/domain/models/user/UpdatePasswordPayload";

export const getMyProfile = () => 
  createApiCall<UserProfile>((signal) => apiGet<UserProfile>("/api/my-config/me", { signal }));

export const updateMyProfile = (payload: UpdateProfilePayload) => 
  createApiCall<string>((signal) => apiPut<string>("/api/my-config/profile", payload, { signal }));

export const updateMyPassword = (payload: UpdatePasswordPayload) => 
  createApiCall<string>((signal) => apiPatch<string>("/api/my-config/password", payload, { signal }));
