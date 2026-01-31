import { useNavigate, Navigate } from "react-router-dom";
import { Filter, Plus, Search } from "lucide-react";
import { useSubjectManagement } from "@/hooks/subjects/useSubjectManagement";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { Button } from "@/ui/components/shadcn/button";
import { Card, CardContent } from "@/ui/components/shadcn/card";
import { Badge } from "@/ui/components/shadcn/badge";
import { AppForm, AppInput, AppSelect, AppSubmitButton } from "@/ui/components/common";
import { PageHeader } from "@/ui/components/common/layout/PageHeader";
import { AppEmptyState } from "@/ui/components/common/feedback/AppEmptyState";
import { subjectFilterSchema, type SubjectFilterFormValues } from "@/domain/schemas/subjectFilterSchema";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/domain/constants/permissions";

export function SubjectsPage() {
  const navigate = useNavigate();
  const { subjects, programOptions, filters, applyFilters } = useSubjectManagement();
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.SUBJECTS_READ)) {
    return <Navigate to="/students" replace />;
  }

  const getProgramName = (programId: string) => {
    return programOptions.find((p) => p.id === programId)?.label || 'Sin programa';
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-in fade-in duration-500">
      <PageHeader
        title="Gestión de Materias"
        description="Administra el catálogo de materias académicas"
        actions={
          <PermissionGuard permission={PERMISSIONS.SUBJECTS_WRITE}>
            <Button className="w-full md:w-auto" onClick={() => navigate("/subjects/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </PermissionGuard>
        }
      />

      <Card>
        <CardContent>
          <AppForm<SubjectFilterFormValues>
            schema={subjectFilterSchema}
            defaultValues={filters}
            onSubmit={(values) => applyFilters(values)}
            className="flex flex-col lg:flex-row gap-4 items-end pt-6"
          >
            <div className="flex-1 w-full">
              <AppInput
                name="search"
                placeholder="Buscar por nombre o código..."
                icon={
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                }
              />
            </div>
            <div className="flex w-full gap-4 lg:w-auto">
              <div className="flex-1 w-full lg:w-48">
                <AppSelect
                  name="programId"
                  placeholder="Todos los programas"
                  options={[{ id: "ALL", label: "Todos los programas" }, ...programOptions]}
                />
              </div>
            </div>
            <AppSubmitButton className="w-full lg:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </AppSubmitButton>
          </AppForm>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Materia</th>
                <th className="px-4 py-3">Programa</th>
                <th className="px-4 py-3">Créditos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron materias
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono">
                        {subject.code}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{subject.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {getProgramName(subject.programId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {subject.credits}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PermissionGuard permission={PERMISSIONS.SUBJECTS_WRITE}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/subjects/edit/${subject.id}`)}
                        >
                          Editar
                        </Button>
                      </PermissionGuard>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {subjects.length === 0 && (
          <AppEmptyState />
        )}

        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{subject.code}</Badge>
                    <Badge variant="secondary">{subject.credits} créditos</Badge>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{subject.name}</p>
                  <p className="text-sm text-gray-600">{getProgramName(subject.programId)}</p>
                </div>
                <PermissionGuard permission={PERMISSIONS.SUBJECTS_WRITE}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/subjects/edit/${subject.id}`)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00178 12.709 2.14646 12.8536C2.29113 12.9982 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM11.2071 2.5L12.5 3.79289L11.7929 4.5L10.5 3.20711L11.2071 2.5ZM10.2071 5.20711L3.91421 11.5L2.5 12.5L3.5 11.0858L9.79289 4.79289L10.2071 5.20711Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
