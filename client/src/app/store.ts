import { configureStore } from "@reduxjs/toolkit";
import headerReducer from 'shared/header/headerSlice'
import navigateReducer from 'shared/navi/navigateSlice'
import toastReducer from 'shared/components/toast/toastSlice'

export const store = configureStore({
  reducer: {
    header: headerReducer,
    toast: toastReducer,
    navicom: navigateReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
