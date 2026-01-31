interface Props {
  label: string;
  value: string;
}

export const InfoField = ({ label, value }: Props) => (
  <div>
    <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value || "N/A"}</p>
  </div>
);
