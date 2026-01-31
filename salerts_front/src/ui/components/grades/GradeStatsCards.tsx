import { Card, CardContent } from "@/ui/components/shadcn/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  average: number;
  approved: number;
  failed: number;
  total: number;
}

export const GradeStatsCards = ({
  average,
  approved,
  failed,
  total,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Promedio general"
        value={`${average.toFixed(2)}/5.0`}
        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        bgClass="bg-blue-100"
      />
      <StatCard
        label="Aprobados"
        value={`${approved} de ${total}`}
        icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        bgClass="bg-green-100"
      />
      <StatCard
        label="Reprobados"
        value={`${failed} de ${total}`}
        icon={<TrendingDown className="w-5 h-5 text-red-600" />}
        bgClass="bg-red-100"
      />
    </div>
  );
};

// Sub-componente interno para evitar repetición
const StatCard = ({ label, value, icon, bgClass }: any) => (
  <Card>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">{value}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgClass}`}
      >
        {icon}
      </div>
    </CardContent>
  </Card>
);
