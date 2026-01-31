import type { Grade, GradeEditableFields } from "@/domain/models/Grade";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/shadcn/table";
import { Input } from "@/ui/components/shadcn/input";
import { Badge } from "@/ui/components/shadcn/badge";

interface Props {
  grades: Grade[];
  isAssigning: boolean;
  onEdit: (id: string, field: keyof GradeEditableFields, val: string) => void;
  getValue: (grade: Grade, field: keyof GradeEditableFields) => number;
}

export const GradeDesktopTable = ({
  grades,
  isAssigning,
  onEdit,
  getValue,
}: Props) => {
  const getStatusColor = (score: number) => {
    if (score >= 4.0) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (score >= 3.0)
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    return "bg-red-100 text-red-800 hover:bg-red-200";
  };

  const renderInputCell = (grade: Grade, field: keyof GradeEditableFields) => {
    if (!isAssigning) return <span>{getValue(grade, field).toFixed(1)}</span>;
    return (
      <Input
        type="number"
        step="0.1"
        min={0}
        max={grade.maxScore}
        className="w-20 h-8"
        value={getValue(grade, field)}
        onChange={(e) => onEdit(grade.id, field, e.target.value)}
      />
    );
  };

  return (
    <div className="hidden md:block rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Materia</TableHead>
            <TableHead className="text-center">Corte 1</TableHead>
            <TableHead className="text-center">Corte 2</TableHead>
            <TableHead className="text-center">Corte 3</TableHead>
            <TableHead className="text-center">Corte 4</TableHead>
            <TableHead className="text-right">Final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{grade.studentName}</span>
                  {/* grade.period is removed from model or not? Check model. It was removed. */} 
                </div>
              </TableCell>
              <TableCell>{grade.subjectName || '-'}</TableCell>
              <TableCell className="text-center">
                {renderInputCell(grade, "term1")}
              </TableCell>
              <TableCell className="text-center">
                {renderInputCell(grade, "term2")}
              </TableCell>
              <TableCell className="text-center">
                {renderInputCell(grade, "term3")}
              </TableCell>
              <TableCell className="text-center">
                {renderInputCell(grade, "term4")}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  className={getStatusColor(grade.finalGrade)}
                  variant="secondary"
                >
                  {grade.finalGrade.toFixed(1)} / {grade.maxScore}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {grades.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron resultados. Seleccione un grupo para ver calificaciones.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
