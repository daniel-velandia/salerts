import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/shadcn/card';
import { Button } from '@/ui/components/shadcn/button';
import { Input } from '@/ui/components/shadcn/input';
import { Label } from '@/ui/components/shadcn/label';
import { Badge } from '@/ui/components/shadcn/badge';
import { Checkbox } from '@/ui/components/shadcn/checkbox';
import { Plus, X, Search } from 'lucide-react';
import { AppForm, AppInput, AppSelect, AppSubmitButton } from '@/ui/components/common';
import type { GroupFormData } from '@/domain/schemas/groupSchema';
import { groupSchema } from '@/domain/schemas/groupSchema';
import type { ScheduleInput, DayOfWeek } from '@/domain/models/Schedule';
import { useFormContext } from 'react-hook-form';

const DAYS = [
  { value: 'MONDAY' as DayOfWeek, label: 'Lunes' },
  { value: 'TUESDAY' as DayOfWeek, label: 'Martes' },
  { value: 'WEDNESDAY' as DayOfWeek, label: 'Miércoles' },
  { value: 'THURSDAY' as DayOfWeek, label: 'Jueves' },
  { value: 'FRIDAY' as DayOfWeek, label: 'Viernes' },
  { value: 'SATURDAY' as DayOfWeek, label: 'Sábado' },
  { value: 'SUNDAY' as DayOfWeek, label: 'Domingo' }
];

interface GroupFormProps {
  onSubmit: (data: GroupFormData, schedules: ScheduleInput[]) => void;
  defaultValues: GroupFormData;
  initialSchedules?: ScheduleInput[];
  isLoading?: boolean;
  periodOptions: Array<{ label: string; id: string }>;
  subjectOptions: Array<{ label: string; id: string }>;
  teacherOptions: Array<{ label: string; id: string }>;
  studentOptions?: Array<{ label: string; id: string }>;
}

const StudentSelector = ({ options }: { options: Array<{ label: string; id: string }> }) => {
  const { setValue, watch } = useFormContext<GroupFormData>();
  const selectedIds = watch('studentIds') || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheck = (id: string, checked: boolean) => {
    const current = selectedIds;
    if (checked) {
      setValue('studentIds', [...current, id]);
    } else {
      setValue('studentIds', current.filter(sId => sId !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar estudiante..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="h-60 overflow-y-auto border rounded-md p-2 space-y-2">
        {filteredOptions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No se encontraron estudiantes</p>
        ) : (
          filteredOptions.map((student) => (
            <div key={student.id} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
              <Checkbox
                id={student.id}
                checked={selectedIds.includes(student.id)}
                onCheckedChange={(checked: boolean) => handleCheck(student.id, checked)}
              />
              <Label htmlFor={student.id} className="cursor-pointer flex-1">
                {student.label}
              </Label>
            </div>
          ))
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {selectedIds.length} estudiante{selectedIds.length !== 1 ? 's' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}.
      </div>
    </div>
  );
};

export function GroupForm({
  onSubmit,
  defaultValues,
  initialSchedules = [],
  isLoading,
  periodOptions,
  subjectOptions,
  teacherOptions,
  studentOptions = []
}: GroupFormProps) {
  const [schedules, setSchedules] = useState<ScheduleInput[]>(initialSchedules);
  const [newSchedule, setNewSchedule] = useState<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }>({
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: ''
  });

  // Update schedules when initialSchedules prop changes (important for edit mode)
  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  const handleAddSchedule = () => {
    if (!newSchedule.startTime || !newSchedule.endTime) {
      alert('Por favor completa los horarios');
      return;
    }

    if (newSchedule.startTime >= newSchedule.endTime) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    // Use time strings directly (appending seconds)
    const scheduleInput: ScheduleInput = {
      dayOfWeek: newSchedule.dayOfWeek,
      startTime: `${newSchedule.startTime}:00`,
      endTime: `${newSchedule.endTime}:00`
    };

    setSchedules([...schedules, scheduleInput]);
    setNewSchedule({ dayOfWeek: 'MONDAY', startTime: '', endTime: '' });
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: GroupFormData) => {
    if (schedules.length === 0) {
      alert('Debes agregar al menos un horario');
      return;
    }
    onSubmit(data, schedules);
  };

  return (
    <div className="space-y-6">
      <AppForm<GroupFormData>
        schema={groupSchema}
        defaultValues={defaultValues}
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Grupo</CardTitle>
            <CardDescription>
              Datos básicos del grupo de materia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                name="groupName"
                label="Nombre del Grupo"
                placeholder="Ej: Grupo A"
              />
              <AppSelect
                name="periodId"
                label="Período Académico"
                placeholder="Seleccione un período"
                options={periodOptions}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppSelect
                name="subjectId"
                label="Materia"
                placeholder="Seleccione una materia"
                options={subjectOptions}
              />
              <AppSelect
                name="teacherId"
                label="Profesor"
                placeholder="Seleccione un profesor"
                options={teacherOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Inscribir Estudiantes</CardTitle>
            <CardDescription>
              Selecciona los estudiantes que formarán parte de este grupo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentSelector options={studentOptions} />
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios de Clase</CardTitle>
            <CardDescription>
              Define los días y horas en que se dicta la materia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulario para agregar horario */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900">Agregar Horario</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dayOfWeek">Día de la Semana</Label>
                  <select
                    id="dayOfWeek"
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    value={newSchedule.dayOfWeek}
                    onChange={(e) => setNewSchedule({
                      ...newSchedule,
                      dayOfWeek: e.target.value as DayOfWeek
                    })}
                  >
                    {DAYS.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora Inicio</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora Fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddSchedule} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Horario
              </Button>
            </div>

            {/* Lista de horarios agregados */}
            {schedules.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Horarios Configurados</h4>
                <div className="space-y-2">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {DAYS.find(d => d.value === schedule.dayOfWeek)?.label}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSchedule(index)}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schedules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No hay horarios configurados</p>
                <p className="text-xs">Agrega al menos un horario para continuar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end pt-4">
          <AppSubmitButton disabled={isLoading}>
            Guardar Grupo
          </AppSubmitButton>
        </div>
      </AppForm>
    </div>
  );
}
