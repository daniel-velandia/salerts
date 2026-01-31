import type { ApiError } from "@/domain/errors/ApiError";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiError {
  message: string | null;
  code: number | undefined;
  isFatalError: boolean;
}

interface UiState {
  loading: boolean;
  error: UiError | null;
}

const initialState: UiState = { loading: false, error: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError: {
      reducer(state, action: PayloadAction<UiError | null>) {
        state.error = action.payload;
      },
      prepare(error: ApiError | null, isFatalError: boolean = false) {
        if (!error) {
          return { payload: null };
        }

        return {
          payload: {
            message: error.message,
            code: error.status,
            isFatalError,
          },
        };
      },
    },
  },
});

export const { setLoading, setError } = uiSlice.actions;
export default uiSlice.reducer;
