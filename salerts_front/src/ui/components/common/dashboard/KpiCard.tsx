interface Props {
  label: string;
  value: string | number;
  color: "blue" | "green" | "red";
}

const colors = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-green-50 text-green-700 border-green-100",
  red: "bg-red-50 text-red-700 border-red-100",
};

export const KpiCard = ({ label, value, color }: Props) => {
  return (
    <div className={`border rounded-lg p-3 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};