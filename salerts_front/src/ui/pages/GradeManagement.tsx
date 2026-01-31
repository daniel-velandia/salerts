import { Filter, Plus, Save, X, FileText } from "lucide-react";
import { Button } from "@/ui/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/components/shadcn/card";
import { useGradeManagement } from "@/hooks/grade/useGradeManagement";
import { GradeStatsCards } from "../components/grades/GradeStatsCards";
import { GradeDesktopTable } from "../components/grades/GradeDesktopTable";
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";
import { AppForm, AppSelect, AppSubmitButton } from "@/ui/components/common";
import { gradeFilterSchema, type GradeFilterFormValues } from "@/domain/schemas/gradeFilterSchema";

export function GradeManagement() {
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.GRADES_READ)) {
    return <Navigate to="/" replace />;
  }

  const {
    grades,
    stats,
    filters,
    groupOptions,
    teacherOptions,
    applyFilters,
    isAssigning,
    setIsAssigning,
    handleEditChange,
    saveChanges,
    cancelChanges,
    getValue,
    downloadGrades,
    isDownloading,
  } = useGradeManagement();

  return (
    <div className="space-y-6 p-2 md:p-6 animate-in fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Calificaciones</h2>
          <p className="text-muted-foreground">Administra y evalúa el desempeño académico.</p>
        </div>

        <div className="flex gap-2">
          {!isAssigning ? (
            <>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={downloadGrades}
                disabled={isDownloading || !filters.groupId || filters.groupId === 'all'}
              >
                <FileText className="w-4 h-4 mr-2" /> 
                {isDownloading ? "Exportando..." : "Exportar"}
              </Button>
              <PermissionGuard permission={PERMISSIONS.GRADES_WRITE}>
                <Button onClick={() => setIsAssigning(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Asignar Notas
                </Button>
              </PermissionGuard>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={cancelChanges}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button onClick={saveChanges}>
                <Save className="w-4 h-4 mr-2" /> Guardar Cambios
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <GradeStatsCards {...stats} />

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <AppForm<GradeFilterFormValues>
            schema={gradeFilterSchema}
            defaultValues={filters}
            onSubmit={applyFilters}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <AppSelect
                name="teacherId"
                placeholder="Profesor"
                options={teacherOptions}
              />
            </div>
            <div className="flex-1 w-full">
              <AppSelect
                name="groupId"
                placeholder="Grupo"
                options={groupOptions}
              />
            </div>
            <div className="w-full md:w-auto">
              <AppSubmitButton className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </AppSubmitButton>
            </div>
          </AppForm>
        </CardContent>
      </Card>

      {/* Desktop Table (Hidden on Mobile) */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Listado de Estudiantes</CardTitle>
          <CardDescription>
            {isAssigning
              ? "Edita las casillas directamente para actualizar las notas."
              : "Vista de solo lectura."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <GradeDesktopTable
            grades={grades}
            isAssigning={isAssigning}
            onEdit={handleEditChange}
            getValue={getValue}
          />
        </CardContent>
      </Card>

      {/* Mobile Cards (Visible on Mobile) */}
      <div className="space-y-4 md:hidden">
        {grades.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No se encontraron calificaciones con los filtros actuales.
            </CardContent>
          </Card>
        )}

        {grades.map((grade) => {
          const statusColor =
            grade.finalGrade >= 4.0 ? "text-green-600 bg-green-50" :
              grade.finalGrade >= 3.0 ? "text-yellow-600 bg-yellow-50" :
                "text-red-600 bg-red-50";

          return (
            <Card key={grade.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-medium">
                        {grade.studentName.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {grade.studentName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {grade.subjectName}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
                    {grade.finalGrade.toFixed(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  {(['term1', 'term2', 'term3', 'term4'] as const).map((term, idx) => (
                    <div key={term} className="space-y-1">
                      <p className="text-gray-500">Corte {idx + 1}</p>
                      {isAssigning ? (
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={grade.maxScore}
                          className="w-full border rounded px-2 py-1"
                          value={getValue(grade, term)}
                          onChange={(e) => handleEditChange(grade.id, term, e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {getValue(grade, term).toFixed(1)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}