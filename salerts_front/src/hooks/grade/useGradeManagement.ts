import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  Grade,
  GradeEditableFields,
  GradeFiltersState,
} from "@/domain/models/Grade";
import { useApi } from "@/hooks/common/useApi";
import { getGradesByGroup, updateGrade, exportGrades } from "@/infraestructure/services/gradeApi";
import { getAllGroups } from "@/infraestructure/services/groupApi";
import { getAllStaff } from "@/infraestructure/services/staffApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import type { Group } from "@/domain/models/Group";
import type { StaffResponse } from "@/domain/models/staff/StaffResponse";
import type { Option } from "@/domain/models/Option";
import type { GradeFilterFormValues } from "@/domain/schemas/gradeFilterSchema";

const fetchGradesWrapper = (params: [string, string?]) => getGradesByGroup(params[0], params[1]);

export const useGradeManagement = () => {
  const dispatch = useAppDispatch();

  // Estado local para filtros
  const [filters, setFilters] = useState<GradeFiltersState>({
    groupId: "",
    teacherId: "all",
  });

  // --- 1. Data Fetching (Resources) ---

  // Obtener Grupos
  const {
    data: groups,
    loading: loadingGroups,
    call: fetchGroups,
  } = useApi<Group[], any>(getAllGroups, {
    autoFetch: false,
    params: {} // Fetch all groups
  });

  // Obtener Profesores
  const {
    data: staff,
    loading: loadingStaff,
    call: fetchStaff,
  } = useApi<StaffResponse[], any>(getAllStaff, {
    autoFetch: false,
    params: { role: 'TEACHER' }
  });

  // Obtener Calificaciones
  const {
    data: remoteGrades,
    loading: isLoadingGrades,
    error: loadError,
    call: fetchGrades,
  } = useApi<Grade[], [string, string?]>(fetchGradesWrapper, { autoFetch: false, params: ["", undefined] });

  // Map Options
  const groupOptions: Option[] = useMemo(() => [
    ...(groups || []).map(g => ({ id: g.id, label: `${g.subjectName} - ${g.groupName}` }))
  ], [groups]);

  const teacherOptions: Option[] = useMemo(() => [
    { id: "all", label: "Todos los profesores" },
    ...(staff || []).map(s => ({ id: s.id, label: s.name }))
  ], [staff]);


  // --- 2. Estado Local (UI & Edición) ---
  const [localGrades, setLocalGrades] = useState<Grade[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editedGrades, setEditedGrades] = useState<
    Record<string, Partial<GradeEditableFields>>
  >({});

  useEffect(() => {
    fetchGroups({});
    fetchStaff({ role: 'TEACHER' });
  }, [fetchGroups, fetchStaff]);

  // --- 3. Sincronización y Efectos ---

  // Fetch cuando cambian los filtros
  useEffect(() => {
    if (filters.groupId && filters.groupId !== "all") {
      fetchGrades([filters.groupId, filters.teacherId]);
    } else {
      setLocalGrades([]); // Clear if no group selected or 'all'
    }
  }, [filters.groupId, filters.teacherId, fetchGrades]);

  // Sincronizar datos remotos al estado local cuando llegan
  useEffect(() => {
    if (remoteGrades) {
      setLocalGrades(remoteGrades);
    }
  }, [remoteGrades]);

  // Manejar estados de carga global
  useEffect(() => {
    const isLoading = loadingGroups || loadingStaff || isLoadingGrades;
    dispatch(setLoading(isLoading));
    if (loadError) {
      dispatch(setError(loadError));
    }
  }, [loadingGroups, loadingStaff, isLoadingGrades, loadError, dispatch]);


  // --- 4. Stats ---
  const stats = useMemo(
    () => ({
      average:
        localGrades.length > 0
          ? localGrades.reduce((sum, g) => sum + g.finalGrade, 0) /
          localGrades.length
          : 0,
      approved: localGrades.filter((g) => g.finalGrade >= 3.0).length,
      failed: localGrades.filter((g) => g.finalGrade < 3.0).length,
      total: localGrades.length,
    }),
    [localGrades]
  );

  // --- 5. Handlers (Interacciones) ---

  const applyFilters = (newFilters: GradeFilterFormValues) => {
    setFilters(prev => ({
      ...prev,
      groupId: newFilters.groupId || prev.groupId,
      teacherId: newFilters.teacherId || "all"
    }));
  };

  const handleEditChange = (
    gradeId: string, // enrollmentId
    field: keyof GradeEditableFields,
    value: string
  ) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    setEditedGrades((prev) => ({
      ...prev,
      [gradeId]: { ...prev[gradeId], [field]: num },
    }));
  };

  const saveChanges = async () => {
    const dirtyEnrollmentIds = Object.keys(editedGrades);

    if (dirtyEnrollmentIds.length === 0) {
      setIsAssigning(false);
      return;
    }

    dispatch(setLoading(true));
    try {
      const promises: Promise<void>[] = [];

      for (const enrollmentId of dirtyEnrollmentIds) {
        const changes = editedGrades[enrollmentId];
        for (const [field, value] of Object.entries(changes)) {
          const termNumber = parseInt((field as string).replace('term', ''));
          if (!isNaN(termNumber) && value !== undefined) {
            const payload = {
              enrollmentId,
              termNumber,
              value: Number(value)
            };
            promises.push(updateGrade(payload).call);
          }
        }
      }

      await Promise.all(promises);

      toast.success("Calificaciones actualizadas correctamente");
      setIsAssigning(false);
      setEditedGrades({});
      // Refrescamos los datos
      if (filters.groupId && filters.groupId !== "all") {
        fetchGrades([filters.groupId, filters.teacherId]);
      }
    } catch (error) {
      console.error(error);
      dispatch(setError({ name: "SaveError", message: "Error al guardar calificaciones" }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const cancelChanges = () => {
    setIsAssigning(false);
    setEditedGrades({});
    if (remoteGrades) setLocalGrades(remoteGrades);
  };

  const getValue = (grade: Grade, field: keyof GradeEditableFields) => {
    return editedGrades[grade.id]?.[field] ?? grade[field];
  };

  return {
    grades: localGrades,
    stats,
    filters,
    groupOptions,
    teacherOptions,
    isAssigning,
    setIsAssigning,
    handleEditChange,
    saveChanges,
    cancelChanges,
    getValue,
    applyFilters,
    downloadGrades: async () => {
      if (!filters.groupId || filters.groupId === 'all') {
        toast.error("Debes seleccionar un grupo para generar el reporte");
        return;
      }
      
      try {
         setIsDownloading(true);
         dispatch(setLoading(true));
         await exportGrades(filters.groupId).call;
         toast.success("Reporte descargado correctamente");
      } catch (error) {
        console.error(error);
        toast.error("Error al descargar el reporte");
      } finally {
        setIsDownloading(false);
        dispatch(setLoading(false));
      }
    },
    isDownloading,
  };
};
