import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/ui/components/shadcn/button";
import {
  AppForm,
  AppInput,
  AppSelect,
  AppSubmitButton,
} from "@/ui/components/common";
import { useStaffManagement } from "@/hooks/staff/useStaffManagement";
import { StaffCardItem } from "@/ui/components/staff/StaffCardItem";
import { useNavigate, Navigate } from "react-router-dom";
import { emptyStaffFilterParams, type StaffFilterParams } from "@/domain/models/staff/StaffFilterParams";
import { staffFilterSchema } from "@/domain/schemas/staffFilterSchema";
import { PageHeader } from "@/ui/components/common/layout/PageHeader";
import { AppEmptyState } from "@/ui/components/common/feedback/AppEmptyState";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";

export function StaffPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Allow access if user can write Teachers OR Coordinators (as per sidebar)
  const canAccess = hasPermission(PERMISSIONS.TEACHERS_READ) || hasPermission(PERMISSIONS.COORDINATORS_READ);

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  const { staffList, programOptions, roleOptions, applyFilters } = useStaffManagement();

  const handleCreate = () => navigate(`/academic-staff/create-edit`);
  const handleEdit = (id: string) =>
    navigate(`/academic-staff/create-edit/${id}`);

  return (
    <div className="space-y-6 p-1 md:p-6 animate-in fade-in duration-500">
      <PageHeader
        title="Personal Académico"
        description="Gestión de docentes y coordinadores"
        actions={
          <PermissionGuard permission={PERMISSIONS.TEACHERS_WRITE}>
            <Button className="w-full md:w-auto" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </PermissionGuard>
        }
      />

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <AppForm<StaffFilterParams>
          schema={staffFilterSchema}
          defaultValues={emptyStaffFilterParams}
          onSubmit={applyFilters}
          className="flex flex-col lg:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <AppInput
              name="search"
              placeholder="Buscar por nombre, email, dpto..."
              icon={
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              }
            />
          </div>
          <div className="flex w-full gap-4 lg:w-auto">

          <div className="flex-1 w-full lg:w-48">
            <AppSelect
              name="programId"
              placeholder="Programa"
              options={[{ id: "ALL", label: "Todos los programas" }, ...programOptions]}
            />
          </div>
          <div className="flex-1 w-full lg:w-48">
            <AppSelect
              name="role"
              placeholder="Rol"
              options={[{ id: "ALL", label: "Todos los roles" }, ...roleOptions]}
            />
          </div>
          </div>
          <AppSubmitButton className="w-full lg:w-auto">
             <Filter className="w-4 h-4 mr-2" />
             Filtrar
          </AppSubmitButton>
        </AppForm>
      </div>

      <div className="space-y-3">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Nombre / Perfil</div>
          <div className="col-span-3">Contacto</div>
          <div className="col-span-3">Rol / Programa</div>
          <div className="col-span-1 text-right">Acción</div>
        </div>

        {staffList.length === 0 ? (
          <AppEmptyState />
        ) : (
          staffList.map((member) => (
            <StaffCardItem
              key={member.id}
              member={member}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
