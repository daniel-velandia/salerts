import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  Grade,
  GradeEditableFields,
  GradeFiltersState,
} from "@/domain/models/Grade";
import { useApi } from "@/hooks/common/useApi";
import { getGradesByGroup, updateGrade, exportGrades } from "@/infraestructure/services/gradeApi";
import { getGlobalOptions, getActiveTermStatus } from "@/infraestructure/services/optionsApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import type { GlobalOptions } from "@/domain/models/options/GlobalOptions";
import type { Option } from "@/domain/models/Option";
import type { GradeFilterFormValues } from "@/domain/schemas/gradeFilterSchema";
import { uploadGradeFile, downloadGradeTemplate } from "@/infraestructure/services/gradeFilesApi";
import type { ActiveStatusResponse, GradeFileUploadResponse } from "@/domain/models/files/GradeFileResponses";

const fetchGradesWrapper = (params: [string, string?]) => getGradesByGroup(params[0], params[1]);

const downloadTemplateApi = (args: { groupId: string | number, noteNumber: number }) =>
  downloadGradeTemplate(args.groupId, args.noteNumber);

const uploadFileApi = (args: { groupId: string | number, noteNumber: number, file: File }) =>
  uploadGradeFile(args.groupId, args.noteNumber, args.file);

export const useGradeManagement = () => {
  const dispatch = useAppDispatch();

  // Estado local para filtros
  const [filters, setFilters] = useState<GradeFiltersState>({
    groupId: "",
    teacherId: "all",
  });

  // --- 1. Data Fetching (Resources) ---

  // Obtener Opciones Globales
  const {
    data: globalOptions,
    loading: loadingOptions,
    call: fetchOptions,
    error: optionsError,
  } = useApi<GlobalOptions, any>(getGlobalOptions, {
    autoFetch: false,
    params: {}
  });

  // Obtener Calificaciones
  const {
    data: remoteGrades,
    loading: isLoadingGrades,
    error: loadError,
    call: fetchGrades,
  } = useApi<Grade[], [string, string?]>(fetchGradesWrapper, { autoFetch: false, params: ["", undefined] });

  // Obtener Estado Activo del Grupo
  const {
    data: activeStatus,
    error: errorActiveStatus,
    loading: loadingActiveStatus,
    call: fetchActiveStatus,
  } = useApi<ActiveStatusResponse, string | number>(getActiveTermStatus, {
    autoFetch: false,
    params: 0
  });

  // Download Template
  const {
    loading: downloadingTemplate,
    call: downloadTemplateCall,
    data: templateBlob,
    error: templateError
  } = useApi<Blob, { groupId: string | number, noteNumber: number }>(downloadTemplateApi, {
    autoFetch: false,
    params: { groupId: 0, noteNumber: 0 }
  });

  // Upload File
  const {
    loading: uploadingFile,
    call: uploadFileCall,
    data: uploadResponse,
    error: uploadError
  } = useApi<GradeFileUploadResponse, { groupId: string | number, noteNumber: number, file: File }>(uploadFileApi, {
    autoFetch: false,
    params: { groupId: 0, noteNumber: 0, file: new File([], "") }
  });

  // Map Options
  const groupOptions: Option[] = useMemo(() => [
    ...(globalOptions?.groups || []).map(g => ({ id: g.id, label: g.label }))
  ], [globalOptions]);

  const teacherOptions: Option[] = useMemo(() => [
    { id: "all", label: "Todos los profesores" },
    ...(globalOptions?.teachers || []).map(s => ({ id: s.id, label: s.name }))
  ], [globalOptions]);


  // --- 2. Estado Local (UI & Edición) ---
  const [localGrades, setLocalGrades] = useState<Grade[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editedGrades, setEditedGrades] = useState<
    Record<string, Partial<GradeEditableFields>>
  >({});

  useEffect(() => {
    fetchOptions({});
  }, [fetchOptions]);

  // --- 3. Sincronización y Efectos ---

  // Fetch cuando cambian los filtros
  useEffect(() => {
    if (filters.groupId && filters.groupId !== "all") {
      fetchGrades([filters.groupId, filters.teacherId]);
      fetchActiveStatus(filters.groupId);
    } else {
      setLocalGrades([]); // Clear if no group selected or 'all'
    }
  }, [filters.groupId, filters.teacherId, fetchGrades, fetchActiveStatus]);

  // Sincronizar datos remotos al estado local cuando llegan
  useEffect(() => {
    if (remoteGrades) {
      setLocalGrades(remoteGrades);
    }
  }, [remoteGrades]);

  // Manejar estados de carga global
  useEffect(() => {
    const isLoading = loadingOptions || isLoadingGrades || downloadingTemplate || uploadingFile || loadingActiveStatus;
    dispatch(setLoading(isLoading));
    const error = loadError || templateError || uploadError || errorActiveStatus || optionsError;
    if (error) {
      dispatch(setError(error));
    }
  }, [
    loadingOptions,
    isLoadingGrades,
    downloadingTemplate,
    uploadingFile,
    loadingActiveStatus,
    loadError,
    templateError,
    uploadError,
    errorActiveStatus,
    optionsError,
    dispatch]);

  // Reactive Handlers for Download/Upload
  useEffect(() => {
    if (templateBlob && activeStatus) {
      const url = window.URL.createObjectURL(templateBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_notas_grupo_${filters.groupId}_corte_${activeStatus.activeTermNumber}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Plantilla descargada correctamente");
    }
  }, [templateBlob]);

  useEffect(() => {
    if (uploadResponse) {
      if (uploadResponse.errorDetails && uploadResponse.errorDetails.length > 0) {
        if (uploadResponse.gradesSaved > 0) {
          toast.warning(`Se guardaron ${uploadResponse.gradesSaved} notas con ${uploadResponse.errorsCount} errores.`);
        } else {
          toast.error(`Error al procesar el archivo: ${uploadResponse.errorsCount} errores encontrados.`);
        }
        console.error("Upload details:", uploadResponse);
      } else {
        toast.success(`Carga exitosa: ${uploadResponse.gradesSaved} notas guardadas.`);
      }
      // Refresh grades
      fetchGrades([filters.groupId, filters.teacherId]);
    }
  }, [uploadResponse]);

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
    // File Upload & Template
    activeStatus,
    gradingEnabled: activeStatus?.gradingEnabled ?? false,
    isUploading: uploadingFile,
    isDownloadingTemplate: downloadingTemplate,
    downloadTemplate: () => {
      if (!filters.groupId || filters.groupId === 'all' || !activeStatus) {
        toast.error("Selecciona un grupo válido para descargar la plantilla");
        return;
      }
      downloadTemplateCall({
        groupId: filters.groupId,
        noteNumber: activeStatus.activeTermNumber
      });
    },
    uploadFile: (file: File) => {
      if (!filters.groupId || filters.groupId === 'all' || !activeStatus) {
        toast.error("Información del grupo no disponible");
        return;
      }

      // Validate Excel extension
      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      if (!validExtensions.some(ext => fileName.endsWith(ext))) {
        toast.error("Solo se permiten archivos Excel (.xls, .xlsx)");
        return;
      }

      uploadFileCall({
        groupId: filters.groupId,
        noteNumber: activeStatus.activeTermNumber,
        file
      });
    }
  };
};
