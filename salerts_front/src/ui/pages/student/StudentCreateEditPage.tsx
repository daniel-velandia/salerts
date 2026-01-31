import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/ui/components/shadcn/button";
import { useStudentForm } from "@/hooks/students/useStudentForm";
import { StudentForm } from "@/ui/components/students/form/StudentForm";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";

export const StudentCreateEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isEdit = Boolean(id);

  if (!hasPermission(PERMISSIONS.STUDENTS_WRITE)) {
    return <Navigate to="/students" replace />;
  }

  const {
    onSubmit,
    programs,
    defaultValues,
  } = useStudentForm(isEdit, id, () => navigate("/students"));

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Editar Estudiante" : "Nuevo Estudiante"}
          </h1>
          <p className="text-sm text-gray-600">
            {isEdit
              ? "Actualiza la información académica y personal"
              : "Registra un nuevo estudiante en el sistema"}
          </p>
        </div>
      </div>

      <StudentForm
        key={JSON.stringify(defaultValues)}
        isEdit={isEdit}
        programs={programs}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};
