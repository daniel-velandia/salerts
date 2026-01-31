import { TabsTrigger } from "../../shadcn";
import { Badge } from "../../shadcn/badge";

interface TabTriggerItemProps {
  value: string;
  label: string;
  count?: number;
  isAlert?: boolean;
}

export const TabTriggerItem = ({ value, label, count = 0, isAlert = false }: TabTriggerItemProps) => (
  <TabsTrigger
    value={value}
    className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-700 rounded-none bg-transparent h-10 px-2"
  >
    {label}
    {count > 0 && (
      <Badge
        variant="secondary"
        className={`ml-2 h-5 px-1.5 text-[10px] ${
          isAlert ? "bg-red-100 text-red-600" : ""
        }`}
      >
        {count}
      </Badge>
    )}
  </TabsTrigger>
);
