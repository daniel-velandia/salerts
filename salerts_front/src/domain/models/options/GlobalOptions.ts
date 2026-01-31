export interface OptionPeriod {
  id: string;
  name: string;
  active: boolean;
}

export interface OptionProgram {
  id: string;
  name: string;
}

export interface OptionSubject {
  id: string;
  name: string;
  programIds: string[];
}

export interface OptionTeacher {
  id: string;
  name: string;
  programIds: string[];
  subjectIds: string[];
}

export interface OptionGroup {
  id: string;
  label: string;
  subjectId: string;
  teacherId: string;
  periodId: string;
}

export interface OptionRole {
  id: string;
  name: string;
}

export interface GlobalOptions {
  periods: OptionPeriod[];
  programs: OptionProgram[];
  subjects: OptionSubject[];
  teachers: OptionTeacher[];
  groups: OptionGroup[];
  roles: OptionRole[];
}
