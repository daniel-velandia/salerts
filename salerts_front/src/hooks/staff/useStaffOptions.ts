import { useEffect } from "react";
import { useApi } from "@/hooks/common/useApi";
import { getAllStaff } from "@/infraestructure/services/staffApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setLoading, setError } from "@/infraestructure/store/uiSlice";
import type { StaffResponse } from "@/domain/models/staff/StaffResponse";

export function useStaffOptions(param?: { role?: string }) {
  const dispatch = useAppDispatch();
  const { data: staffList, loading, error, call } = useApi<StaffResponse[], { role?: string }>(getAllStaff, {
    autoFetch: true,
    params: { role: param?.role }
  });

  useEffect(() => {
    dispatch(setLoading(loading));
    if (error && error.status !== 499) dispatch(setError(error));
  }, [loading, error, dispatch]);

  const options = (staffList || []).map(staff => ({
    label: `${staff.name} ${staff.lastname}`,
    value: staff.id,
    id: staff.id 
  }));

  return {
    options,
    loading,
    error,
    refresh: call
  };
}
