export interface GroupFilterParams {
  search?: string;
  periodId?: string;
  subjectId?: string;
  teacherId?: string;
}

export const emptyGroupFilterParams: GroupFilterParams = {
  search: "",
  periodId: "",
  subjectId: "",
  teacherId: "",
};
