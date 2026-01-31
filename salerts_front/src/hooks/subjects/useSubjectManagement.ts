import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import { getAllSubjects } from "@/infraestructure/services/subjectApi";
import { getGlobalOptions } from "@/infraestructure/services/optionsApi";
import { emptySubjectFilterFormValues, type SubjectFilterFormValues } from "@/domain/schemas/subjectFilterSchema";
import type { Option } from "@/domain/models/Option";
import type { SubjectFilterParams } from "@/domain/models/subject/SubjectFilterParams";
import type { Subject } from "@/domain/models/subject/Subject";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";

interface Result {
  subjects: Subject[];
  programOptions: Option[];
  subjectOptions: Option[];
  filters: SubjectFilterFormValues;
  applyFilters: (newFilters: SubjectFilterFormValues) => void;
}

export const useSubjectManagement = (): Result => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<SubjectFilterFormValues>(emptySubjectFilterFormValues);

  const {
    data: subjects,
    loading: loadingSubjects,
    error: errorSubjects,
    call: fetchSubjects,
  } = useApi<Subject[], SubjectFilterParams>(getAllSubjects);

  const { 
    data: options, 
    loading: loadingOptions,
    error: errorOptions,
  } = useApi<GlobalOptions, void>(getGlobalOptions, {
    autoFetch: true,
    params: undefined,
  });

  useEffect(() => {
    const isLoading = loadingSubjects || loadingOptions;
    const error = errorSubjects || errorOptions;

    dispatch(setLoading(isLoading));
    if (error && error.status !== 499)
      dispatch(setError(error));
  }, [
    loadingSubjects,
    loadingOptions,
    errorSubjects,
    errorOptions,
    dispatch
  ]);

  // Load subjects only when filters are applied
  useEffect(() => {
    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== "ALL");
    if (hasFilters) {
      const paramsToSend: SubjectFilterParams = {
        programId: filters.programId === "ALL" ? undefined : filters.programId,
        search: filters.search === "" ? undefined : filters.search
      };
      fetchSubjects(paramsToSend);
    }
  }, [filters, fetchSubjects]);

  const applyFilters = (newFilters: SubjectFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const programOptions: Option[] = useMemo(() => 
    (options?.programs || []).map((p) => ({ id: p.id, label: p.name }))
  , [options]);

  const subjectOptions: Option[] = useMemo(() => 
    (options?.subjects || []).map((s) => ({ id: s.id.toString(), label: s.name }))
  , [options]);

  return {
    subjects: subjects || [],
    programOptions,
    subjectOptions,
    filters,
    applyFilters,
  };
};
