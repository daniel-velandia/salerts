import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/ui/components/shadcn/button";
import { SubjectForm } from "@/ui/components/subjects/SubjectForm";
import { useSubjectForm } from "@/hooks/subjects/useSubjectForm";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";

export function SubjectCreateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isEdit = Boolean(id);

  if (!hasPermission(PERMISSIONS.SUBJECTS_WRITE)) {
    return <Navigate to="/subjects" replace />;
  }

  const { onSubmit, defaultValues, programOptions } = useSubjectForm(
    isEdit,
    id,
    () => navigate("/subjects")
  );

  return (
    <div className="space-y-6 py-8 px-4 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="icon" onClick={() => navigate("/subjects")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Editar Materia" : "Nueva Materia"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Actualiza la información de la materia"
              : "Registra una nueva materia en el sistema"}
          </p>
        </div>
      </div>

      <SubjectForm
        key={JSON.stringify(defaultValues)}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        programs={programOptions}
        isEdit={isEdit}
      />
    </div>
  );
}
