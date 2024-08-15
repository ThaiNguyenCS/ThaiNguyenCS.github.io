import { configureStore } from "@reduxjs/toolkit";
import SubmitPopupSlice from "./slicers/SubmitPopupSlice";

const store = configureStore({
    reducer: {
        submitPopup: SubmitPopupSlice,
    }
});

export default store;
