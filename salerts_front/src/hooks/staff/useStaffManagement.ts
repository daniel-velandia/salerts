import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/hooks/common/useApi";
import { getAllStaff } from "@/infraestructure/services/staffApi";
import { getGlobalOptions } from "@/infraestructure/services/optionsApi";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import type { StaffFilterParams } from "@/domain/models/staff/StaffFilterParams";
import type { StaffResponse } from "@/domain/models/staff/StaffResponse";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";
import type { Option } from "@/domain/models/Option";

interface Result {
  staffList: StaffResponse[];
  programOptions: Option[];
  roleOptions: Option[];
  teacherOptions: Option[];
  applyFilters: (newFilters: StaffFilterParams) => void;
}

export const useStaffManagement = (): Result => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<StaffFilterParams>({});

  const {
    data: staffList,
    loading: staffLoading,
    error: staffError,
    call: fetchStaff
  } = useApi<StaffResponse[], StaffFilterParams>(getAllStaff, {
    autoFetch: false,
    params: filters,
  });

  const {
    data: options,
    loading: optionsLoading,
    error: optionsError,
  } = useApi<GlobalOptions, void>(getGlobalOptions, {
    autoFetch: true,
    params: undefined,
  });

  // Load staff only when filters are applied
  useEffect(() => {
    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "");
    if (hasFilters) {
      fetchStaff(filters);
    }
  }, [filters, fetchStaff]);

  useEffect(() => {
    dispatch(setLoading(staffLoading || optionsLoading));
    const error = staffError || optionsError;
    if (error && error.status !== 499)
      dispatch(setError(error));
  }, [staffLoading, optionsLoading, staffError, optionsError, dispatch]);

  const applyFilters = (newFilters: StaffFilterParams) => {
    const paramsToSend: StaffFilterParams = {
      ...newFilters,
      programId: newFilters.programId === "ALL" ? undefined : newFilters.programId,
      role: newFilters.role === "ALL" ? undefined : newFilters.role,
      search: newFilters.search || undefined,
    };
    setFilters(paramsToSend);
  };

  const programOptions: Option[] = useMemo(() => 
    (options?.programs || []).map((p) => ({ id: p.id, label: p.name }))
  , [options]);

  const roleOptions: Option[] = useMemo(() => 
    (options?.roles || []).map((r) => ({ id: r.id, label: r.name }))
  , [options]);

  const teacherOptions: Option[] = useMemo(() => 
    (options?.teachers || []).map((t) => ({ id: t.id.toString(), label: t.name }))
  , [options]);

  return {
    staffList: staffList || [],
    programOptions,
    roleOptions,
    teacherOptions,
    applyFilters,
  };
};
