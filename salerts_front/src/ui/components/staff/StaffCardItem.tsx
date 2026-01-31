import { Card, CardContent } from "@/ui/components/shadcn/card";
import { Badge } from "@/ui/components/shadcn/badge";
import { Button } from "@/ui/components/shadcn/button";
import { Edit2, Mail, GraduationCap, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/ui/components/shadcn/avatar";
import type { StaffResponse } from "@/domain/models/staff/StaffResponse";

interface StaffCardItemProps {
  member: StaffResponse;
  onEdit: (id: string) => void;
}

export function StaffCardItem({ member, onEdit }: StaffCardItemProps) {
  const isProf = member.role === 'TEACHER';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pw-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div  className="col-span-10 md:col-span-5 lg:col-span-4 order-1 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-none bg-transparent shrink-0">
              <AvatarFallback 
                className={`
                  w-full h-full rounded-full flex items-center justify-center 
                  text-sm font-bold
                  ${isProf 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-purple-100 text-purple-600'
                  }
                `}
              >
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{member.name} {member.lastname}</span>
              <span className="lg:hidden text-xs text-gray-500">{member.email}</span>
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-3 lg:order-2 items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate" title={member.email}>{member.email}</span>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3 order-3 md:order-2 lg:order-3 flex flex-col lg:flex-row lg:items-center gap-2">
            <Badge variant={isProf ? "secondary" : "default"} className="w-fit">
              {isProf ? 'Profesor' : 'Coordinador'}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
                {isProf ? <GraduationCap className="w-3 h-3"/> : <Building2 className="w-3 h-3"/>}
                <span>{member.programName || '-'}</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-1 order-2 md:order-3 lg:order-4 flex justify-end">
            <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => onEdit(member.id)}>
              <Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-600" />
            </Button>
          </div>
        
        </div>
      </CardContent>
    </Card>
  );
}