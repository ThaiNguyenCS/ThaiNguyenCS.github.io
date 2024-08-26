import { configureStore } from "@reduxjs/toolkit";
import SubmitPopupSlice from "./slicers/SubmitPopupSlice";
import AppSlice from "./slicers/AppSlice";
import ContextDictSlice from "./slicers/ContextDictSlice";
const store = configureStore({
    reducer: {
        submitPopup: SubmitPopupSlice,
        appState: AppSlice,
        dictState: ContextDictSlice,
    }
});

export default store;
