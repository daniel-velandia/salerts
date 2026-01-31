import { Badge } from "@/ui/components/shadcn/badge";
import type { Student } from "@/domain/models/students/Student";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface Props {
  student: Student;
  alertsCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export const StudentListItem = ({
  student,
  alertsCount,
  isSelected,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left hover:bg-red-50/50 transition-colors flex items-center gap-3 group relative cursor-pointer ${
        isSelected ? "bg-red-50" : ""
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
      )}

      <Avatar className="h-10 w-10 shrink-0 border-none bg-transparent">
        <AvatarFallback
          className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold bg-red-100 text-red-600 border border-red-200"
        >
          {student.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isSelected ? "text-red-900 font-bold" : "text-gray-900"
          }`}
        >
          {student.name} {student.lastname}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-500 truncate max-w-40">
            {student.programName}
          </p>
        </div>
      </div>

      {alertsCount > 0 && (
        <Badge
          variant="destructive"
          className="shrink-0 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-[10px] shadow-sm"
        >
          {alertsCount}
        </Badge>
      )}
    </button>
  );
};
