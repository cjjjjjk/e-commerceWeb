import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderState {
  theme: "light" | "dark",
  fieldHideList: ("man" | "women" | "order" )[],
  isTransference: boolean;
}

const initialState: HeaderState = {
  theme: "dark",
  fieldHideList: [],
  isTransference: true

};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderTheme: (state, act: PayloadAction<"light"|"dark">)=> {state.theme = act.payload},
    setHideList: (state, act:  PayloadAction<("man" | "women" | "order" )[]>)=>{state.fieldHideList = act.payload},
    setIsTransference: (state, act: PayloadAction<boolean>)=> {state.isTransference = act.payload}
  },
});

export const { setHeaderTheme ,setHideList, setIsTransference} = headerSlice.actions;
export default headerSlice.reducer;
