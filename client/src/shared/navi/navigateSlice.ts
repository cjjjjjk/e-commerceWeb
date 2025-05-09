import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigateState {
    isBackHome: boolean,
    isReload: boolean,
    isHide: boolean,
}

const initialState: NavigateState = {
    isBackHome: false,
    isReload: false,
    isHide: false,
} 

const navigateSlice = createSlice({
    name: "navigateCom",
    initialState,
    reducers: {
        setNaviToBackHome: (state, act: PayloadAction<boolean>)=> {state.isBackHome = act.payload},
        SetLoadingNaviBar: (state)=> {state.isReload = !state.isReload},
        setHideNavBar: (state, act: PayloadAction<boolean>)=> {state.isHide = act.payload},
    }
})

export const { setNaviToBackHome, SetLoadingNaviBar, setHideNavBar } = navigateSlice.actions;
export default navigateSlice.reducer;
