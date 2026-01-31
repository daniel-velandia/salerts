import { useEffect } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import { emptyStaff, type StaffFormData } from "@/domain/schemas/staffSchema";
import {
  getStaffById,
  createStaff,
  updateStaff,
} from "@/infraestructure/services/staffApi";
import type { CreateStaffPayload } from "@/domain/models/staff/CreateStaffPayload";
import type { Option } from "@/domain/models/Option";

interface Result {
  onSubmit: (data: StaffFormData) => void;
  defaultValues: StaffFormData;
  roleOptions: Option[];
}

export const useStaffForm = (
  isEdit: boolean,
  id?: string,
  onSuccess?: () => void,
): Result => {
  const dispatch = useAppDispatch();

  const {
    loading: loadingStaff,
    data: staffToEdit,
    error: errorStaff,
    call: fetchStaff,
  } = useApi(getStaffById);

  const {
    loading: loadingCreate,
    error: errorCreate,
    data: createResult,
    call: executeCreate,
  } = useApi<void, CreateStaffPayload>(createStaff);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    data: updateResult,
    call: executeUpdate,
  } = useApi<void, { id: string; data: CreateStaffPayload }>(updateStaff);

  useEffect(() => {
    if (isEdit && id) fetchStaff(id);
  }, [isEdit, id, fetchStaff]);

  useEffect(() => {
    const isCreationSuccess = createResult !== null && !loadingCreate && !errorCreate
    const isUpdateSuccess = updateResult !== null && !loadingUpdate && !errorUpdate

    if (isCreationSuccess || isUpdateSuccess) onSuccess?.();
  }, [
    createResult,
    loadingCreate,
    errorCreate,
    updateResult,
    loadingUpdate,
    errorUpdate,
    onSuccess,
  ]);

  useEffect(() => {
    const isLoading = loadingStaff || loadingCreate || loadingUpdate;
    const error = errorStaff || errorCreate || errorUpdate;

    dispatch(setLoading(isLoading));
    if (error && error.status !== 499)
      dispatch(setError(error, errorStaff !== null));
  }, [
    loadingStaff,
    loadingCreate,
    loadingUpdate,
    errorStaff,
    errorCreate,
    errorUpdate,
    dispatch,
  ]);

  const onSubmit = (data: StaffFormData) => {
    const payload: CreateStaffPayload = {
      name: data.name,
      lastname: data.lastname,
      nit: data.nit,
      address: data.address,
      cellphone: data.cellphone,
      email: data.email,
      password: data.nit, 
      rolesName: data.role === "BOTH" ? ["TEACHER", "COORDINATOR"] : [data.role],
    };

    if (isEdit && id)
       executeUpdate({ id, data: payload });
    else
       executeCreate(payload);
  };

  const getRoleFromApi = (roles: string[]): string => {
    let role = "";

    if (!roles || roles.length === 0)
      role = "";
    else if (roles.includes("TEACHER") && roles.includes("COORDINATOR"))
      role = "BOTH";
    else
      role = roles[0];

    return role;
  };

  const mappedStaff: StaffFormData = staffToEdit
    ? {
        name: staffToEdit.name,
        email: staffToEdit.email,
        role: getRoleFromApi(staffToEdit.roles),
        lastname: staffToEdit.lastname,
        nit: staffToEdit.nit,
        address: staffToEdit.address,
        cellphone: staffToEdit.cellPhone,
      }
    : emptyStaff;

  const roleOptions: Option[] = [
    { id: "TEACHER", label: "Profesor" },
    { id: "COORDINATOR", label: "Coordinador" },
    { id: "BOTH", label: "Ambos (Profesor y Coordinador)" },
  ];

  return {
    onSubmit,
    defaultValues: mappedStaff,
    roleOptions,
  };
};