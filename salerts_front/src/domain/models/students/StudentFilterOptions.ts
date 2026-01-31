export interface FilterProgram {
  id: string;
  name: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  subjectId: string;
  teacherId: string;
}

export interface FilterSubject {
  id: string;
  name: string;
  programIds: string[];
  groups: FilterGroup[];
}

export interface FilterTeacher {
  id: string;
  name: string;
  programIds: string[];
  subjectIds: string[];
}

export interface StudentFilterOptions {
  programs: FilterProgram[];
  subjects: FilterSubject[];
  teachers: FilterTeacher[];
}
