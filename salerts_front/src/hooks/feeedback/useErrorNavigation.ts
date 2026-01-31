import { logout } from "@/infraestructure/store/authSlice";
import { useAppDispatch } from "@/infraestructure/store/hooks";
import { setError, type UiError } from "@/infraestructure/store/uiSlice";
import { useNavigate } from "react-router-dom";

export const useErrorNavigation = (error: UiError | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleConfirm = () => {
    const isFatal = error?.isFatalError;
    const code = error?.code;

    dispatch(setError(null));

    if (code === 401 || code === 403) {
      dispatch(logout())
      navigate("/", { replace: true });
      return;
    }

    if (isFatal) {
      const canGoBack = window.history.state && window.history.state.idx > 0;

      if (canGoBack) {
        navigate(-1);
      } else {
        navigate("/students", { replace: true });
      }
    }
  };

  return { handleConfirm };
};