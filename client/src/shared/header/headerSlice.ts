import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderState {
  theme: "light" | "dark",
}

const initialState: HeaderState = {
  theme: "dark",
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderTheme: (state, act: PayloadAction<"light"|"dark">)=> {state.theme = act.payload},
  },
});

export const { setHeaderTheme } = headerSlice.actions;
export default headerSlice.reducer;
