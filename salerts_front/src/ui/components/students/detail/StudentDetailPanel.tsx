import { useState, useEffect } from "react";
import { Button } from "@/ui/components/shadcn/button";
import { Card, CardContent } from "@/ui/components/shadcn/card";
import { Badge } from "@/ui/components/shadcn/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
} from "@/ui/components/shadcn/tabs";
import { Edit2, Search } from "lucide-react";
import { GradesTabContent } from "./tabs/GradesTabContent";
import { AlertsTabContent } from "./tabs/AlertsTabContent";
import { StudentInfoTab } from "./tabs/StudentInfoTab";
import type { FullStudentData } from "@/domain/models/students/FullStudentData";
import { TabTriggerItem } from "../list/TabTriggerItem";
import { KpiCard } from "../../common/dashboard/KpiCard";
import { PermissionGuard } from "../../auth/PermissionGuard";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { markAlertsAsRead } from "@/infraestructure/services/studentApi";

interface Props {
  student: FullStudentData | null;
  onEdit: (id: string) => void;
}

export const StudentDetailPanel = ({ student, onEdit }: Props) => {
  const [activeTab, setActiveTab] = useState("info");

  // Mark alerts as read when alerts tab is selected
  useEffect(() => {
    if (activeTab === "alerts" && student) {
      markAlertsAsRead(student.studentInfo.id).call.catch(error => {
        console.error("Error marking alerts as read:", error);
      });
    }
  }, [activeTab, student]);

  if (!student) {
    return (
      <Card className="h-full flex items-center justify-center border-gray-200 shadow-sm bg-white">
        <CardContent className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium">
            Selecciona un estudiante
          </h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm bg-white flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold">
              {student.studentInfo.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {student.studentInfo.name} {student.studentInfo.lastname}
              </h3>
              <p className="text-sm text-gray-600">
                {student.studentInfo.programName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-gray-500"
                >
                  {student.subjectInfo.currentSemester}
                </Badge>
                <span className="text-xs text-gray-400">
                  {student.studentInfo.email}
                </span>
              </div>
            </div>
          </div>

          <PermissionGuard permission={PERMISSIONS.STUDENTS_WRITE}>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => onEdit(student.studentInfo.id)}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </Button>
          </PermissionGuard>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <KpiCard
            label="Promedio Global"
            value={student.subjectInfo.overallAverage.toFixed(2)}
            color="blue"
          />
          <KpiCard
            label="Alertas"
            value={student.alertInfo.alerts.length}
            color="red"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="border-b border-gray-200 px-6 shrink-0">
          <TabsList className="w-full grid grid-cols-4 bg-transparent p-0 gap-2">
            <TabTriggerItem value="info" label="Info" />
            <TabTriggerItem value="grades" label="Notas" />
            <TabTriggerItem
              value="alerts"
              label="Alertas"
              count={student.alertInfo.unreadCount}
              isAlert
            />
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <TabsContent value="info" className="mt-0">
            <StudentInfoTab student={student.studentInfo} />
          </TabsContent>

          <TabsContent value="grades" className="mt-0">
            <GradesTabContent enrollments={student.subjectInfo.subjects} />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <AlertsTabContent alerts={student.alertInfo.alerts} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};