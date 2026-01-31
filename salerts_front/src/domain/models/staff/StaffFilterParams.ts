export interface StaffFilterParams {
  search?: string;
  programId?: string;
  role?: string;
}

export const emptyStaffFilterParams: StaffFilterParams = {
  search: "",
  programId: "",
  role: "",
};