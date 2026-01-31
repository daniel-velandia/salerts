import { apiGet, apiPut, createApiCall, axiosInstance } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { Grade } from "@/domain/models/Grade";

interface StudentGradeResponse {
  enrollmentId: string;
  student: {
    id: string;
    name: string;
    lastname: string;
    // other fields ignored for now
  };
  term1: number;
  term2: number;
  term3: number;
  term4: number;
  finalGrade: number;
}

interface GradesResponse {
  groupId: string;
  groupName: string;
  subject: {
    id: string;
    code: string;
    name: string;
  };
  students: StudentGradeResponse[];
}

export interface UpdateGradePayload {
  enrollmentId: string;
  termNumber: number;
  value: number;
}

export const getGradesByGroup = (groupId: string, teacherId?: string): ApiCall<Grade[]> => {
  return createApiCall(async (signal) => {
    // If no groupId is provided (e.g. "all"), we might return empty or handle differently.
    // The API requires groupId. 
    if (!groupId || groupId === 'all') return [];

    const params: Record<string, string> = { groupId };
    if (teacherId && teacherId !== 'all') {
      params.teacherId = teacherId;
    }

    const response = await apiGet<GradesResponse>("/api/operations/grades", { signal, params });

    // Map response to Grade domain model
    return response.students.map((s) => ({
      id: s.enrollmentId, // Using enrollmentId as the unique ID for the grid row
      enrollmentId: s.enrollmentId,
      studentId: s.student.id,
      studentName: `${s.student.name} ${s.student.lastname}`,
      subjectName: `${response.subject.name} - ${response.groupName}`,
      term1: s.term1,
      term2: s.term2,
      term3: s.term3,
      term4: s.term4,
      finalGrade: s.finalGrade,
      maxScore: 5.0, // Assuming 5.0 scale based on example
    }));
  });
};

export const updateGrade = (payload: UpdateGradePayload): ApiCall<void> => {
  return createApiCall((signal) =>
    apiPut<void>("/api/operations/grade", payload, { signal })
  );
};

export const exportGrades = (groupId: string): ApiCall<void> => {
  return createApiCall(async (signal) => {
    const response = await axiosInstance.get("/api/operations/grades/export", {
      params: { groupId },
      responseType: 'blob',
      signal,
    });

    // Extract filename from header
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'calificaciones.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};
