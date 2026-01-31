import type { ReactNode } from "react";

interface AppEmptyStateProps {
  message?: string;
  children?: ReactNode;
  transparent?: boolean;
}

export function AppEmptyState({
  message = "No se encontraron resultados.",
  children,
  transparent = false
}: AppEmptyStateProps) {
  const bgClass = transparent ? "bg-transparent border-transparent" : "bg-gray-50 border-gray-200 border-dashed";
  
  return (
    <div className={`text-center py-12 rounded-lg border ${bgClass} text-gray-500`}>
      {children || message}
    </div>
  );
}
