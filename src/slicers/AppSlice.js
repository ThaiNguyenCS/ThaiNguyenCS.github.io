import { createSlice } from "@reduxjs/toolkit";

const initialState = {isLogined: false, activePath: 0};

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
                window.location.reload();
            }
        },
        setActivePath (state, action) 
        {
            state.activePath = action.payload;
        }
    }
})

export default AppSlice.reducer;
export const {setLoginState, setActivePath} = AppSlice.actions;