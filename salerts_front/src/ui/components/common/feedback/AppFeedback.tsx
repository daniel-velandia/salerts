import { useAppSelector } from "@/infraestructure/store/hooks";
import { AppLoadingSpinner } from "./AppLoadingSpinner";
import { AppErrorDialog } from "./AppErrorDialog";

export const AppFeedback = () => {
  const { loading, error } = useAppSelector((state) => state.ui);

  return (
    <>
      <AppLoadingSpinner loading={loading} />
      <AppErrorDialog error={error} />
    </>
  );
};
