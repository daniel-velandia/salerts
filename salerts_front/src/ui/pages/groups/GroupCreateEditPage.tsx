import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/ui/components/shadcn/button";
import { GroupForm } from "@/ui/components/groups/GroupForm";
import { useGroupForm } from "@/hooks/groups/useGroupForm";
import { usePeriodManagement } from "@/hooks/periods/usePeriodManagement";
import { useSubjectManagement } from "@/hooks/subjects/useSubjectManagement";
import { useStaffManagement } from "@/hooks/staff/useStaffManagement";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";

export function GroupCreateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isEdit = Boolean(id);

  if (!hasPermission(PERMISSIONS.GROUPS_WRITE)) {
    return <Navigate to="/groups" replace />;
  }

  const { onSubmit, isLoading, defaultValues, existingSchedules, availableStudents } = useGroupForm(
    isEdit,
    id,
    () => navigate("/groups")
  );

  const { periods } = usePeriodManagement();
  const { subjectOptions } = useSubjectManagement();
  const { teacherOptions } = useStaffManagement();

  const periodOptions = periods.map(p => ({
    label: `${p.name}${p.activeState ? ' (Activo)' : ''}`,
    id: p.id
  }));

  return (
    <div className="space-y-6 p-4 md:p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="icon" onClick={() => navigate("/groups")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Editar Grupo" : "Nuevo Grupo"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Modifica los datos del grupo"
              : "Crea un nuevo grupo de materia"}
          </p>
        </div>
      </div>

      <GroupForm
        key={JSON.stringify(defaultValues)}
        defaultValues={defaultValues}
        initialSchedules={existingSchedules}
        onSubmit={onSubmit}
        isLoading={isLoading}
        periodOptions={periodOptions}
        subjectOptions={subjectOptions as Array<{ label: string; id: string }>}
        teacherOptions={teacherOptions as Array<{ label: string; id: string }>}
        studentOptions={availableStudents.map(s => ({ id: s.studentInfo.id, label: `${s.studentInfo.name} ${s.studentInfo.lastname}` }))}
      />
    </div>
  );
}
