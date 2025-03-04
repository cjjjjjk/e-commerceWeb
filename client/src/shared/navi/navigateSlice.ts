import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigateState {
    isBackHome: boolean;
}

const initialState: NavigateState = {
    isBackHome: false 
} 

const navigateSlice = createSlice({
    name: "navigateCom",
    initialState,
    reducers: {
        setNaviToBackHome: (state, act: PayloadAction<boolean>)=> {state.isBackHome = act.payload}
    }
})

export const { setNaviToBackHome } = navigateSlice.actions;
export default navigateSlice.reducer;
