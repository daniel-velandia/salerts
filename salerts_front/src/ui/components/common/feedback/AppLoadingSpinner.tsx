import { Spinner } from "../../shadcn";

interface Props {
  loading: boolean;
}

export const AppLoadingSpinner = ({ loading }: Props) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-10 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          Cargando...
        </span>
      </div>
    </div>
  );
};
