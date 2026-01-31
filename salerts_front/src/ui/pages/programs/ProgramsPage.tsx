import { Search, Plus, Edit2, GraduationCap, BookOpen, User } from 'lucide-react';
import { Button } from '@/ui/components/shadcn/button';
import { Input } from '@/ui/components/shadcn/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/shadcn/card';
import { useProgramManagement } from '@/hooks/programs/useProgramManagement';
import { ProgramDialog } from '@/ui/components/programs/ProgramDialog';
import { PageHeader } from '@/ui/components/common/layout/PageHeader';
import { AppEmptyState } from "@/ui/components/common/feedback/AppEmptyState";
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";

export function ProgramsPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.PROGRAMS_READ)) {
    return <Navigate to="/" replace />;
  }

  const {
    filteredPrograms,
    searchTerm,
    coordinatorOptions,
    isDialogOpen,
    defaultValues,
    setSearchTerm,
    setIsDialogOpen,
    openDialog,
    handleSaveProgram,
  } = useProgramManagement();

  const getCoordinatorName = (id: string) => {
    return coordinatorOptions.find(opt => opt.id === id)?.label || 'Sin coordinador';
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Gestión de Programas"
        description="Administra los programas académicos"
        actions={
          <PermissionGuard permission={PERMISSIONS.PROGRAMS_WRITE}>
            <Button className="w-full md:w-auto" onClick={() => openDialog(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </PermissionGuard>
        }
      />

      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <PermissionGuard permission={PERMISSIONS.PROGRAMS_WRITE}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openDialog(program)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </PermissionGuard>
              </div>
              <CardTitle className="mt-4 text-lg">{program.name}</CardTitle>
              {program.code && <p className="text-sm text-gray-600">Código: {program.code}</p>}
            </CardHeader>
            <CardContent className="space-y-3">
              {program.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs">Duración</p>
                    <p className="text-gray-900">{program.duration} semestres</p>
                  </div>
                </div>
              )}
              
              {program.credits !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs">Créditos</p>
                    <p className="text-gray-900">{program.credits}</p>
                  </div>
                </div>
              )}

              {program.coordinatorId && (
                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs">Coordinador</p>
                    <p className="text-gray-900 truncate">{getCoordinatorName(program.coordinatorId)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <AppEmptyState />
      )}

      <ProgramDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSaveProgram}
        defaultValues={defaultValues}
        coordinatorOptions={coordinatorOptions}
      />
    </div>
  );
}
