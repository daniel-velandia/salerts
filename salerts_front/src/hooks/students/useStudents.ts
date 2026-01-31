import { useCallback, useEffect, useState, useMemo } from "react";
import { useApi } from "@/hooks/common/useApi";
import { getAllStudents } from "@/infraestructure/services/studentApi";
import { getGlobalOptions } from "@/infraestructure/services/optionsApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import type { FullStudentData } from "@/domain/models/students/FullStudentData";
import type { StudentFilterParams } from "@/domain/models/students/StudentFilterParams";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";
import type { Option } from "@/domain/models/Option";
import type { StudentFilterFormValues } from "@/domain/schemas/studentFilterSchema";

export interface Result {
  students: FullStudentData[];
  selectedStudent: FullStudentData | null;
  programs: Option[];
  subjects: Option[];
  teachers: Option[];
  filterStudents: (params: StudentFilterFormValues) => void;
  selectStudent: (student: FullStudentData) => void;
}

export const useStudents = (): Result => {
  const dispatch = useAppDispatch();

  const [filterParams, setQueryParams] = useState<StudentFilterParams>({});
  const [selectedStudent, setSelectedStudent] =
    useState<FullStudentData | null>(null);

  const {
    loading: loadingStudents,
    data: students,
    error: errorStudents,
    call: fetchStudents
  } = useApi<FullStudentData[], StudentFilterParams>(getAllStudents, {
    autoFetch: false,
    params: filterParams,
  });

  const {
    loading: loadingOptions,
    data: options,
    error: errorOptions,
  } = useApi<GlobalOptions, void>(getGlobalOptions, {
    autoFetch: true,
    params: undefined,
  });

  // Load students only when filters are applied
  useEffect(() => {
    const hasFilters = Object.values(filterParams).some(v => v !== undefined && v !== "");
    if (hasFilters) {
      fetchStudents(filterParams);
    }
  }, [filterParams, fetchStudents]);

  useEffect(() => {
    dispatch(setLoading(loadingStudents || loadingOptions));
    const error = errorStudents || errorOptions;
    if (error && error.status !== 499) dispatch(setError(error));
  }, [loadingStudents, loadingOptions, errorStudents, errorOptions, dispatch]);

  const filterStudents = useCallback((filters: StudentFilterFormValues) => {
    const newFilters: StudentFilterParams = {
      search: filters.search || undefined,
      programId: filters.programId === "ALL" ? undefined : filters.programId || undefined,
      scheduleId: filters.scheduleId === "ALL" ? undefined : filters.scheduleId || undefined,
      teacherId: filters.teacherId === "ALL" ? undefined : filters.teacherId || undefined,
    }
    setQueryParams(newFilters);
  }, []);

  const selectStudent = useCallback((student: FullStudentData) => {
    setSelectedStudent(student);
  }, []);

  const programs: Option[] = useMemo(() => 
    (options?.programs.map((p) => ({ id: p.id, label: p.name })) ?? [])
  , [options]);

  const subjects: Option[] = useMemo(() => 
    (options?.groups
      .filter(g => {
        if (!filterParams.programId) return true;
        // Match group's subject with the program
        const subject = options.subjects.find(s => s.id === g.subjectId);
        return subject?.programIds.includes(filterParams.programId);
      })
      .map((g) => ({ id: g.id, label: g.label })) ?? [])
  , [options, filterParams.programId]);

  const teachers: Option[] = useMemo(() => 
    (options?.teachers
      .filter((t) =>
        !filterParams.programId ||
        t.programIds.includes(filterParams.programId),
      )
      .map((t) => ({ id: t.id, label: t.name })) ?? [])
  , [options, filterParams.programId]);

  return {
    students: students ?? [],
    selectedStudent,
    programs,
    subjects,
    teachers,
    filterStudents,
    selectStudent,
  };
};
