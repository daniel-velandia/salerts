import { useStaffForm } from "@/hooks/staff/useStaffForm";
import { Button } from "@/ui/components/shadcn";
import { StaffForm } from "@/ui/components/staff/StaffForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";

export function StaffCreateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isEdit = Boolean(id);

  const canAccess = hasPermission(PERMISSIONS.TEACHERS_WRITE) || hasPermission(PERMISSIONS.COORDINATORS_WRITE);

  if (!canAccess) {
    return <Navigate to="/academic-staff" replace />;
  }

  const handleBack = () => {
    navigate("/academic-staff");
  };

  const { defaultValues, roleOptions, onSubmit } = useStaffForm(isEdit, id, handleBack);

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
            {isEdit ? "Editar Personal" : "Nuevo Personal"}
          </h1>
          <p className="text-sm text-gray-600">
            {isEdit
              ? "Actualiza la información del personal"
              : "Registra un nuevo personal en el sistema"}
          </p>
        </div>
      </div>

      <StaffForm
        key={JSON.stringify(defaultValues)}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isEdit={isEdit}
        roleOptions={roleOptions}
      />

    </div>
  );
}
