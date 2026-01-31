import { Plus, Edit2, Users, Clock, BookOpen, User, Search, Filter } from 'lucide-react';
import { Button } from '@/ui/components/shadcn/button';
import { Badge } from '@/ui/components/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/shadcn/card';
import { useGroupManagement } from '@/hooks/groups/useGroupManagement';
import { useNavigate, Navigate } from 'react-router-dom';
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { AppForm, AppInput, AppSelect, AppSubmitButton } from '@/ui/components/common';
import { groupFilterSchema } from '@/domain/schemas/groupFilterSchema';
import type { GroupFilterParams } from '@/domain/models/groups/GroupFilterParams';

const DAYS_ES = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
} as const;

export function GroupsPage() {
  const navigate = useNavigate();
  const {
    filteredGroups,
    filters,
    applyFilters,
    statistics,
    periodOptions: rawPeriodOptions,
    subjectOptions: rawSubjectOptions,
    teacherOptions: rawTeacherOptions,
  } = useGroupManagement();

  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.GROUPS_READ)) {
    return <Navigate to="/" replace />;
  }

  const periodOptions = [
    { id: 'ALL', label: 'Todos los períodos' },
    ...rawPeriodOptions
  ];

  const subjectOptions = [
    { id: 'ALL', label: 'Todas las materias' },
    ...rawSubjectOptions
  ];

  const teacherOptions = [
    { id: 'ALL', label: 'Todos los profesores' },
    ...rawTeacherOptions
  ];

  const handleCreateGroup = () => {
    navigate('/groups/new');
  };

  const handleEditGroup = (id: string) => {
    navigate(`/groups/edit/${id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h2>
          <p className="text-sm text-gray-600">
            Administra grupos de materias con profesores y horarios
          </p>
        </div>
        <PermissionGuard permission={PERMISSIONS.GROUPS_WRITE}>
          <Button onClick={handleCreateGroup}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Grupo
          </Button>
        </PermissionGuard>
      </div>

            {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{statistics.totalGroups}</p>
              <p className="text-sm text-gray-600">Grupos Totales</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{statistics.uniqueSubjects}</p>
              <p className="text-sm text-gray-600">Materias Activas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{statistics.uniqueTeachers}</p>
              <p className="text-sm text-gray-600">Profesores</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{statistics.totalSchedules}</p>
              <p className="text-sm text-gray-600">Horarios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
  <CardContent className="pt-6">
    <AppForm<GroupFilterParams>
      schema={groupFilterSchema}
      defaultValues={filters}
      onSubmit={applyFilters}
      className="space-y-4"
    >
      {/* Cambiamos lg:grid-cols-4 a lg:grid-cols-5 para que quepan 
          los 4 inputs + el botón en una sola fila en pantallas grandes.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <AppInput
            name="search"
            placeholder="Buscar por nombre, materia..."
            icon={
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            }
          />
        </div>
        <div className="space-y-2">
          <AppSelect
            name="periodId"
            placeholder="Filtrar por período"
            options={periodOptions}
          />
        </div>
        <div className="space-y-2">
          <AppSelect
            name="subjectId"
            placeholder="Filtrar por materia"
            options={subjectOptions}
          />
        </div>
        <div className="space-y-2">
          <AppSelect
            name="teacherId"
            placeholder="Filtrar por profesor"
            options={teacherOptions}
          />
        </div>

        {/* Botón integrado en el grid:
            - w-full: siempre ocupa el ancho de su columna.
            - sm:col-span-2: en tablets ocupa dos columnas para no verse tan estirado.
            - lg:col-span-1: en escritorio vuelve a ocupar solo una celda.
        */}
        <div className="sm:col-span-2 lg:col-span-1">
          <AppSubmitButton className="w-full">
            <Filter className="w-4 h-4 mr-2" /> Filtrar
          </AppSubmitButton>
        </div>
      </div>
    </AppForm>
  </CardContent>
</Card>

      {/* Lista de grupos */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron grupos</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      {group.groupName}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{group.subjectName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{group.teacherName}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <PermissionGuard permission={PERMISSIONS.GROUPS_WRITE}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGroup(group.id)}
                      >
                        <Edit2 className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Horarios:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.schedules.map((schedule) => (
                      <Badge key={schedule.id} variant="secondary" className="px-3 py-1">
                        {DAYS_ES[schedule.day]} {schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
