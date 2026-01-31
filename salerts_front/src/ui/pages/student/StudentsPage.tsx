import { useStudents } from "@/hooks/students/useStudents";
import { Button } from "@/ui/components/shadcn/button";
import { Plus } from "lucide-react";
import { StudentDetailPanel } from "@/ui/components/students/detail/StudentDetailPanel";
import { StudentListPanel } from "@/ui/components/students/list/StudentListPanel";
import { useNavigate, Navigate } from "react-router-dom";
import { PageHeader } from "@/ui/components/common/layout/PageHeader";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/domain/constants/permissions";

export const StudentsPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.STUDENTS_READ)) {
    return <Navigate to="/" replace />;
  }

  const {
    students,
    selectedStudent,
    programs,
    subjects,
    teachers,
    filterStudents,
    selectStudent,
  } = useStudents();

  const handleCreate = () => {
    navigate("/student");
  };

  const handleEdit = (id: string) => {
    navigate(`/student/${id}`);
  };

  return (
    <div className="flex flex-col h-[calc(10vh-80px)] p-6 gap-6">
      <PageHeader
        title="Gestión de Estudiantes"
        description="Vista unificada de información académica"
        actions={
          <PermissionGuard permission={PERMISSIONS.STUDENTS_WRITE}>
            <Button className="w-full md:w-auto" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 h-125 lg:h-full">
          <StudentListPanel
            students={students}
            selectedId={selectedStudent?.studentInfo.id}
            programs={programs}
            subjects={subjects}
            teachers={teachers}
            filterStudents={filterStudents}
            onSelect={selectStudent}
          />
        </div>

        <div className="lg:col-span-8 h-auto lg:h-full">
          <StudentDetailPanel student={selectedStudent} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};
