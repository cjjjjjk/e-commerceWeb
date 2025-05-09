import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  link?: string;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<{ message: string; type: Toast["type"]; link?: string }>) => {
      if (state.toasts.length >= 5) {
        state.toasts.shift(); 
      }
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
