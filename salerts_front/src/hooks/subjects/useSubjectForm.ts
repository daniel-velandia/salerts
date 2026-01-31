import { useEffect } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import {
  getSubjectById,
  createSubject,
  updateSubject,
} from "@/infraestructure/services/subjectApi";
import type { Program } from "@/domain/models/program/Program";
import { getAllPrograms } from "@/infraestructure/services/programApi";
import type { Subject } from "@/domain/models/subject/Subject";
import { emptyCreateSubjectPayload, type CreateSubjectPayload } from "@/domain/models/subject/CreateSubjectPayload";
import type { UpdateSubjectParams } from "@/domain/models/subject/UpdateSubjectParams";
import type { Option } from "@/domain/models/Option";

interface Result {
  onSubmit: (data: CreateSubjectPayload) => void;
  defaultValues: CreateSubjectPayload;
  programOptions: Option[];
}

export const useSubjectForm = (
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
    loading: loadingSubject,
    data: subjectToEdit,
    error: errorSubject,
    call: fetchSubject,
  } = useApi<Subject, string>(getSubjectById);

  const {
    loading: loadingCreate,
    error: errorCreate,
    data: createResult,
    call: executeCreate,
  } = useApi<void, CreateSubjectPayload>(createSubject);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    data: updateResult,
    call: executeUpdate,
  } = useApi<void, UpdateSubjectParams>(updateSubject);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    if (isEdit && id) fetchSubject(id);
  }, [isEdit, id, fetchSubject]);

  useEffect(() => {
    const isCreateSuccess = createResult !== null && !loadingCreate && !errorCreate;
    const isUpdateSuccess = updateResult !== null && !loadingUpdate && !errorUpdate;

    if (isCreateSuccess || isUpdateSuccess) onSuccess?.();
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
    const isLoading = loadingSubject || loadingCreate || loadingUpdate || loadingPrograms;
    const error = errorSubject || errorPrograms || errorCreate || errorUpdate;

    dispatch(setLoading(isLoading));
    if (error && error.status !== 499)
      dispatch(setError(error, errorSubject !== null || errorPrograms !== null));
  }, [
    loadingSubject,
    loadingCreate,
    loadingUpdate,
    loadingPrograms,
    errorSubject,
    errorCreate,
    errorUpdate,
    errorPrograms,
    dispatch,
  ]);

  const onSubmit = (data: CreateSubjectPayload) => {
    if (isEdit && id)
      executeUpdate({ id, data });
    else
      executeCreate(data);
  };

  const programOptions: Option[] = programsData?.map((p) => ({
    id: p.id,
    label: p.name,
  })) || [];

  return {
    onSubmit,
    defaultValues: subjectToEdit || emptyCreateSubjectPayload,
    programOptions,
  };
};
