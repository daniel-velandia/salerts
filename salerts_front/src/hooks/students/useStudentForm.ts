import { useEffect } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import type { Program } from "@/domain/models/program/Program";
import { getAllPrograms } from "@/infraestructure/services/programApi";
import {
  getStudentById,
  createStudent,
  updateStudent,
} from "@/infraestructure/services/studentApi";
import type { StudentDetailResponse } from "@/domain/models/students/StudentDetailResponse";
import type { UpdateStudentParams } from "@/domain/models/students/UpdateStudentParams";
import { emptyCreateStudentPayload, type CreateStudentPayload } from "@/domain/models/students/CreateStudentPayload";
import type { Option } from "@/domain/models/Option";

interface Result {
  onSubmit: (data: CreateStudentPayload) => void;
  programs: Option[];
  defaultValues: CreateStudentPayload;
}

export const useStudentForm = (
  isEdit: boolean,
  id?: string,
  onSuccess?: () => void,
): Result => {
  const dispatch = useAppDispatch();

  const {
    loading: loadingPrograms,
    data: programsData,
    error: errorPrograms,
    call: fetchPrograms,
  } = useApi<Program[], void>(getAllPrograms);

  const {
    loading: loadingStudent,
    data: studentToEdit,
    error: errorStudent,
    call: fetchStudent,
  } = useApi<StudentDetailResponse, string>(getStudentById);

  const {
    loading: loadingSave,
    error: errorSave,
    data: saveResult,
    call: executeSave,
  } = useApi<void, CreateStudentPayload>(createStudent);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    data: updateResult,
    call: executeUpdate,
  } = useApi<void, UpdateStudentParams>(updateStudent);

  useEffect(() => {
    fetchPrograms();
    if (isEdit && id) fetchStudent(id);
  }, [isEdit, id, fetchStudent, fetchPrograms]);

  useEffect(() => {
    if (
      (saveResult !== null && !loadingSave && !errorSave) ||
      (updateResult !== null && !loadingUpdate && !errorUpdate)
    ) {
      onSuccess?.();
    }
  }, [
    saveResult,
    loadingSave,
    errorSave,
    updateResult,
    loadingUpdate,
    errorUpdate,
    onSuccess,
  ]);

  useEffect(() => {
    const isLoading =
      loadingPrograms || loadingStudent || loadingSave || loadingUpdate;
    const error = errorPrograms || errorStudent || errorSave || errorUpdate;

    dispatch(setLoading(isLoading));
    if (error && error.status !== 499)
      dispatch(setError(error, errorPrograms !== null || errorStudent !== null));
  }, [
    loadingPrograms,
    loadingStudent,
    loadingSave,
    loadingUpdate,
    errorPrograms,
    errorStudent,
    errorSave,
    errorUpdate,
    dispatch,
  ]);

  const onSubmit = (data: CreateStudentPayload) => {
    if (isEdit && id)
      executeUpdate({ id, data });
    else
      executeSave(data);
  };

  const studentToEditPayload: CreateStudentPayload = studentToEdit
    ? {
        name: studentToEdit.name,
        lastname: studentToEdit.lastName,
        nit: studentToEdit.nit,
        email: studentToEdit.email,
        cellphone: studentToEdit.cellPhone,
        address: studentToEdit.address,
        programId: studentToEdit.progId,
      }
    : emptyCreateStudentPayload;

  const programOptions: Option[] = (programsData || []).map((p) => ({ id: p.id, label: p.name }));

  return {
    onSubmit,
    programs: programOptions,
    defaultValues: studentToEditPayload,
  };
};
