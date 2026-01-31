import { useEffect, useState } from "react";
import { useApi } from "@/hooks/common/useApi";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, setLoading } from "@/infraestructure/store/uiSlice";
import type { GroupFormData } from "@/domain/schemas/groupSchema";
import type { ScheduleInput } from "@/domain/models/Schedule";
import {
  getGroupById,
  createGroup,
  updateGroup,
  enrollStudent,
  unenrollStudent,
  type CreateGroupPayload,
} from "@/infraestructure/services/groupApi";
import { getAllStudents } from "@/infraestructure/services/studentApi";
import type { Group } from "@/domain/models/Group";
import type { FullStudentData } from "@/domain/models/students/FullStudentData";

const emptyGroup: GroupFormData = {
  groupName: "",
  subjectId: "",
  teacherId: "",
  periodId: "",
  studentIds: [],
};

interface Result {
  onSubmit: (data: GroupFormData, schedules: ScheduleInput[]) => void;
  isLoading: boolean;
  defaultValues: GroupFormData;
  existingSchedules: ScheduleInput[];
  availableStudents: FullStudentData[];
}

export const useGroupForm = (
  isEdit: boolean,
  id?: string,
  onSuccess?: () => void,
): Result => {
  const dispatch = useAppDispatch();
  const [existingSchedules, setExistingSchedules] = useState<ScheduleInput[]>([]);

  // Fetch group for editing
  const {
    loading: loadingGroup,
    data: groupToEdit,
    error: errorGroup,
    call: fetchGroup,
  } = useApi(getGroupById);

  // Fetch all students for the selector
  // We use a wrapper since getAllStudents expects params, we pass empty object
  const {
    data: availableStudents,
    call: fetchStudents,
  } = useApi<FullStudentData[], any>(getAllStudents);


  // Create Group
  const {
    loading: loadingCreate,
    error: errorCreate,
    data: createResult,
  } = useApi<Group, CreateGroupPayload>(createGroup);

  // Update Group
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    data: updateResult,
    call: executeUpdate,
  } = useApi<Group, { id: string; data: CreateGroupPayload }>(updateGroup);

  useEffect(() => {
    fetchStudents({});
    if (isEdit && id) fetchGroup(id);
  }, [isEdit, id, fetchGroup, fetchStudents]);

  useEffect(() => {
    if (groupToEdit) {
      // Convert the schedules from response format to input format
      const schedules: ScheduleInput[] = groupToEdit.schedules.map((s) => ({
        dayOfWeek: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
      }));
      setExistingSchedules(schedules);
    }
  }, [groupToEdit]);

  // Handle success manually to allow enrollment chained calls
  // We removed the automatic onSuccess effect for createResult to handle it in onSubmit

  useEffect(() => {
    // Only for update we can use the effect or handle it in onSubmit too.
    // Keeping update simple for now.
    const isUpdateSuccess = updateResult !== null && !loadingUpdate && !errorUpdate;
    const isCreateSuccess = createResult !== null && !loadingCreate && !errorCreate;
    if (isUpdateSuccess || isCreateSuccess) onSuccess?.();
  }, [updateResult, loadingUpdate, errorUpdate, createResult, loadingCreate, errorCreate, onSuccess]);

  useEffect(() => {
    const isLoading = loadingGroup || loadingCreate || loadingUpdate;
    const error = errorGroup || errorCreate || errorUpdate;

    dispatch(setLoading(isLoading));
    if (error && error.status !== 499) dispatch(setError(error));
    // Note: validation errors (422) might be handled by form, but here checks generic api errors
  }, [loadingGroup, loadingCreate, loadingUpdate, errorGroup, errorCreate, errorUpdate, dispatch]);

  const onSubmit = async (data: GroupFormData, schedules: ScheduleInput[]) => {
    const payload: CreateGroupPayload = {
      groupName: data.groupName,
      teacherId: data.teacherId,
      subjectId: data.subjectId,
      periodId: data.periodId,
      schedules: schedules,
    };

    if (isEdit && id) {
      // Handle unenrollments and enrollments for edit mode
      dispatch(setLoading(true));
      try {
        // 1. Identify students to unenroll (were enrolled but now deselected)
        // We need to match by email since backend doesn't provide studentId in enrollment response
        if (groupToEdit?.enrolledStudents && availableStudents && data.studentIds) {
          // Get emails of currently selected students
          const currentStudentEmails = new Set(
            availableStudents
              .filter(s => data.studentIds?.includes(s.studentInfo.id))
              .map(s => s.studentInfo.email)
          );

          const studentsToUnenroll = groupToEdit.enrolledStudents.filter(
            enrollment => !currentStudentEmails.has(enrollment.email)
          );

          // Unenroll removed students
          if (studentsToUnenroll.length > 0) {
            console.log('Unenrolling students:', studentsToUnenroll);
            const unenrollPromises = studentsToUnenroll.map(enrollment =>
              unenrollStudent(enrollment.enrollmentId).call
            );
            await Promise.all(unenrollPromises);
          }
        }

        // 2. Identify students to enroll (newly selected)
        // Compare current selection with original enrollments by email
        if (groupToEdit?.enrolledStudents && availableStudents && data.studentIds) {
          const originalEmails = new Set(
            groupToEdit.enrolledStudents.map(e => e.email)
          );

          const studentsToEnroll = availableStudents
            .filter(s =>
              data.studentIds?.includes(s.studentInfo.id) &&
              !originalEmails.has(s.studentInfo.email)
            )
            .map(s => s.studentInfo.id);

          // Enroll new students
          if (studentsToEnroll.length > 0) {
            console.log('Enrolling new students:', studentsToEnroll);
            const enrollPromises = studentsToEnroll.map(studentId =>
              enrollStudent(id, studentId).call
            );
            await Promise.all(enrollPromises);
          }
        }

        // 3. Update the group itself
        executeUpdate({ id, data: payload });
      } catch (error) {
        console.error(error);
        dispatch(setError({ name: "UpdateError", message: "Error al actualizar inscripciones" }));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      // New logic for Create with Enroll
      dispatch(setLoading(true));
      try {
        // 1. Create Group
        const group = await createGroup(payload).call;

        // 2. Enroll Students if any
        if (data.studentIds && data.studentIds.length > 0 && group.id) {
          const enrollmentPromises = data.studentIds.map(studentId =>
            enrollStudent(group.id, studentId).call
          );
          // We await all enrollments. If one fails, it might throw. 
          // We could use allSettled to avoid failing the whole process if one student fails.
          await Promise.all(enrollmentPromises);
        }

        onSuccess?.();
      } catch (error) {
        console.error(error);
        dispatch(setError({ name: "CreateError", message: "Error al crear grupo o inscribir estudiantes" }));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  // Match students by email since backend doesn't provide student IDs in the group response
  const getMatchedStudentIds = (): string[] => {
    if (!groupToEdit?.enrolledStudents || !availableStudents) return [];

    const enrolledEmails = new Set(groupToEdit.enrolledStudents.map(s => s.email));
    return availableStudents
      .filter(student => enrolledEmails.has(student.studentInfo.email))
      .map(student => student.studentInfo.id);
  };

  const mappedGroup: GroupFormData = groupToEdit
    ? {
      groupName: groupToEdit.groupName,
      subjectId: groupToEdit.subjectId || "",
      teacherId: groupToEdit.teacherId || "",
      periodId: groupToEdit.periodId || "",
      studentIds: getMatchedStudentIds(),
    }
    : emptyGroup;

  return {
    onSubmit,
    isLoading: loadingGroup || loadingCreate || loadingUpdate,
    defaultValues: mappedGroup,
    existingSchedules,
    availableStudents: availableStudents || [],
  };
};
