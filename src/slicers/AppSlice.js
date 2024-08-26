import { createSlice } from "@reduxjs/toolkit";

const initialState = {isLogined: false};

const AppSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setLoginState (state, action) {
            if(action.payload)
            {
                state.isLogined = true
            }
            else
            {
                state.isLogined = false
            }
        }
    }
})

export default AppSlice.reducer;
export const {setLoginState} = AppSlice.actions;