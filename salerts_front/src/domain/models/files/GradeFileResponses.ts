export interface ActiveStatusResponse {
  activeTermNumber: number;
  deadline: string;
  message: string;
  gradingEnabled: boolean;
}

export interface GradeFileUploadResponse {
  rowsProcessed: number;
  gradesSaved: number;
  errorsCount: number;
  errorDetails: string[];
}
