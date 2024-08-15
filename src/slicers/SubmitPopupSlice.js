import { createSlice } from "@reduxjs/toolkit";

const SubmitPopupSlice = createSlice({
    name: "submitPopup",
    initialState: {isOpen: false},
    reducers: {
        openPopup (state) {
            return {isOpen: true};
        },
        closePopup (state) {
            return {isOpen: false};
        }
    }
})

export default SubmitPopupSlice.reducer;

export const {openPopup, closePopup} = SubmitPopupSlice.actions;