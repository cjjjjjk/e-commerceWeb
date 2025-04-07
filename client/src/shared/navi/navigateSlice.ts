import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigateState {
    isBackHome: boolean,
    isReload: boolean
}

const initialState: NavigateState = {
    isBackHome: false,
    isReload: false,
} 

const navigateSlice = createSlice({
    name: "navigateCom",
    initialState,
    reducers: {
        setNaviToBackHome: (state, act: PayloadAction<boolean>)=> {state.isBackHome = act.payload},
        SetLoadingNaviBar: (state)=> {state.isReload = !state.isReload}
    }
})

export const { setNaviToBackHome, SetLoadingNaviBar } = navigateSlice.actions;
export default navigateSlice.reducer;
