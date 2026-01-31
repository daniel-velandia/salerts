import type { EnrolledSubject } from "@/domain/models/academic/EnrolledSubject";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/shadcn/table";

interface Props {
  enrollments: EnrolledSubject[];
}

export const GradesTabContent = ({ enrollments }: Props) => {
  if (!enrollments.length)
    return (
      <div className="text-center py-8 text-gray-500">
        Sin matrículas activas.
      </div>
    );

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 hover:bg-transparent">
            <TableHead className="w-[30%] pl-0">Asignatura</TableHead>
            <TableHead className="text-center">Corte 1</TableHead>
            <TableHead className="text-center">Corte 2</TableHead>
            <TableHead className="text-center">Corte 3</TableHead>
            <TableHead className="text-center">Corte 4</TableHead>
            <TableHead className="text-right pr-0">Acumulado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enr) => {
            return (
              <TableRow
                key={enr.enrollmentId}
                className="border-b border-gray-50 hover:bg-transparent"
              >
                <TableCell className="pl-0">
                  <div className="font-medium text-gray-900">
                    {enr.subjectName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {enr.subjectCode} • {enr.groupName}
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono text-gray-600">
                  {enr.term1}
                </TableCell>
                <TableCell className="text-center font-mono text-gray-600">
                  {enr.term2}
                </TableCell>
                <TableCell className="text-center font-mono text-gray-600">
                  {enr.term3}
                </TableCell>
                <TableCell className="text-center font-mono text-gray-600">
                  {enr.term4}
                </TableCell>
                <TableCell className="text-right font-bold text-gray-900 pr-0">
                  {enr.definitive}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
