import type { Student } from "@/domain/models/students/Student";
import { InfoField } from "../../../common/dashboard/InfoField";

interface Props {
  student: Student;
}

export const StudentInfoTab = ({ student }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-transparent">
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
          Personal
        </h4>
        <InfoField
          label="Nombre Completo"
          value={student.name + " " + student.lastname}
        />
        <InfoField label="Email Institucional" value={student.email} />
        <InfoField label="Nit" value={student.nit} />
        <InfoField label="Telefono" value={student.phone} />
        <InfoField label="Dirección" value={student.address} />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
          Académico
        </h4>
        <InfoField label="Programa" value={student.programName} />
      </div>
    </div>
  );
};