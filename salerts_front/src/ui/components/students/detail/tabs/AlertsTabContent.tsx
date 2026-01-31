import { Card, CardContent } from "@/ui/components/shadcn/card";
import { Badge } from "@/ui/components/shadcn/badge";
import { Clock } from "lucide-react";
import type { Alert } from "@/domain/models/alerts/Alert";

interface Props {
  alerts: Alert[];
}

export const AlertsTabContent = ({ alerts }: Props) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No hay alertas activas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className="bg-red-50 border border-red-100 shadow-none"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-200 text-red-800 hover:bg-red-200 border-0 rounded-sm px-2 font-normal">
                  {alert.type.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-red-400/80">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(alert.date).toLocaleDateString()}
              </div>
            </div>

            <p className="text-sm text-red-800 leading-relaxed">
              {alert.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
