import { apiDelete, apiGet, apiPost, apiPut, createApiCall } from "./config";
import type { ApiCall } from "@/domain/models/ApiCall";
import type { Group } from "@/domain/models/Group";
import type { ScheduleInput, DayOfWeek } from "@/domain/models/Schedule";

// Internal interface matching the backend response
interface ScheduleBackend {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface StudentInGroupBackend {
  enrollmentId: string;
  fullName: string;
  email: string;
  // Assuming studentId *might* be present or we use enrollmentId as fallback if studentId is strictly needed by the form? 
  // The form uses studentId. If the backend doesn't provide it, we can't preselect.
  // We'll add it as optional to see if it catches anything, otherwise we rely on enrollmentId? 
  // Actually, let's look for 'id' which is common.
  id?: string;
  studentId?: string;
}

interface GroupBackend {
  id: string;
  groupName: string;
  scheduleDescription: string;
  schedules: ScheduleBackend[];
  period: { id: string; name: string; active: boolean };
  subject: { id: string; name: string; code: string; credits: number; programId: string };
  teacher: { id: string; fullName: string; email: string };
  students: StudentInGroupBackend[];
}

// Mapper function
const mapGroupFromBackend = (group: GroupBackend): Group => ({
  id: group.id,
  groupName: group.groupName,
  subjectName: group.subject.name,
  teacherName: group.teacher.fullName,
  scheduleDescription: group.scheduleDescription,
  periodId: group.period.id,
  subjectId: group.subject.id,
  teacherId: group.teacher.id,
  studentIds: group.students?.map(s => s.id || '').filter(Boolean) || [],
  enrolledStudents: group.students?.map(s => ({
    enrollmentId: s.enrollmentId,
    studentId: s.id,
    email: s.email
  })) || [],
  schedules: (group.schedules || []).map(s => ({
    id: s.id,
    day: s.day,
    startTime: s.startTime,
    endTime: s.endTime
  }))
});

export interface GetGroupsParams {
  periodId?: string;
  teacherId?: string;
  subjectId?: string;
}

export const getAllGroups = (params?: GetGroupsParams): ApiCall<Group[]> => {
  const queryParams = new URLSearchParams();
  if (params?.periodId) queryParams.append('periodId', params.periodId);
  if (params?.teacherId) queryParams.append('teacherId', params.teacherId);
  if (params?.subjectId) queryParams.append('subjectId', params.subjectId);

  const url = queryParams.toString()
    ? `/api/groups?${queryParams.toString()}`
    : '/api/groups';

  return createApiCall(
    async (signal) => {
      const groups = await apiGet<GroupBackend[]>(url, { signal });
      return groups.map(mapGroupFromBackend);
    }
  );
};

export const getGroupById = (id: string): ApiCall<Group> => {
  return createApiCall(
    async (signal) => {
      const group = await apiGet<GroupBackend>(`/api/groups/${id}`, { signal });
      return mapGroupFromBackend(group);
    }
  );
};

export interface CreateGroupPayload {
  groupName: string;
  teacherId: string;
  subjectId: string;
  periodId: string;
  schedules: ScheduleInput[];
}

export const createGroup = (data: CreateGroupPayload): ApiCall<Group> => {
  return createApiCall(
    async (signal) => {
      const group = await apiPost<GroupBackend>("/api/groups", data, { signal });
      return mapGroupFromBackend(group);
    }
  );
};

export interface UpdateGroupParams {
  id: string;
  data: CreateGroupPayload;
}

export const updateGroup = ({ id, data }: UpdateGroupParams): ApiCall<Group> => {
  return createApiCall(
    async (signal) => {
      const group = await apiPut<GroupBackend>(`/api/groups/${id}`, data, { signal });
      return mapGroupFromBackend(group);
    }
  );
};

export const enrollStudent = (groupId: string, studentId: string): ApiCall<void> => {
  return createApiCall(
    async (signal) => apiPost<void>("/api/operations/enroll", { groupId, studentId }, { signal })
  );
};

export const unenrollStudent = (enrollmentId: string): ApiCall<void> => {
  return createApiCall(
    async (signal) => apiDelete(`/api/operations/enrollment/${enrollmentId}`, { signal })
  );
};
