import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/ui/components/shadcn/card";
import { Separator } from "@/ui/components/shadcn/separator";
import { StudentListItem } from "./StudentListItem";
import {
  AppForm,
  AppInput,
  AppSelect,
  AppSubmitButton,
} from "@/ui/components/common";
import type { FullStudentData } from "@/domain/models/students/FullStudentData";
import { emptyStudentFilterFormValues, studentFilterSchema, type StudentFilterFormValues } from "@/domain/schemas/studentFilterSchema";
import type { Option } from "@/domain/models/Option";
import { AppEmptyState } from "@/ui/components/common/feedback/AppEmptyState";

interface Props {
  students: FullStudentData[];
  selectedId: string | undefined;
  programs: Option[];
  subjects: Option[];
  teachers: Option[];
  filterStudents: (params: StudentFilterFormValues) => void;
  onSelect: (student: FullStudentData) => void;
}

export const StudentListPanel = ({
  students,
  selectedId,
  programs,
  subjects,
  teachers,
  filterStudents,
  onSelect,
}: Props) => {

  const handleSubmit = (data: StudentFilterFormValues) => {
    filterStudents(data);
  };

  return (
    <Card className="flex flex-col h-full border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3 px-4 space-y-0">
        <AppForm<StudentFilterFormValues>
          schema={studentFilterSchema}
          defaultValues={emptyStudentFilterFormValues}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <AppInput
            name="search"
            placeholder="Buscar por nombre, email o NIT..."
            icon={
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <AppSelect
              name="programId"
              placeholder="Programa"
              options={[{ id: "ALL", label: "Todos los programas" }, ...programs]}
            />
            <AppSelect
              name="scheduleId"
              placeholder="Materia"
              options={[{ id: "ALL", label: "Todas las materias" }, ...subjects]}
            />
            <AppSelect
              name="teacherId"
              placeholder="Profesor"
              options={[{ id: "ALL", label: "Todos los profesores" }, ...teachers]}
            />
          </div>

          <AppSubmitButton>
            <Filter className="w-3 h-3 mr-2" />
            Filtrar
          </AppSubmitButton>
        </AppForm>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 overflow-hidden p-0 bg-muted/10">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {students.length > 0 ? (
            <div className="divide-y divide-border">
              {students.map((student) => (
                <StudentListItem
                  key={student.studentInfo.id}
                  student={student.studentInfo}
                  alertsCount={student.alertInfo.unreadCount}
                  isSelected={selectedId === student.studentInfo.id}
                  onClick={() => onSelect(student)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
                <AppEmptyState 
                  message="No se encontraron estudiantes con los filtros aplicados."
                  transparent={true} 
                />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
