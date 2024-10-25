import { createSlice } from "@reduxjs/toolkit";

const initialState = {isLogined: false, activePath: 0, email: "", appname: ""};

const AppSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setLoginState (state, action) {
            const payload = action.payload
                state.isLogined = payload.login
                state.email = payload.email
                state.appname = payload.appname
                if(!payload.login)
                    window.location.reload(); // if user logged out, reload page
        },
        setActivePath (state, action) 
        {
            state.activePath = action.payload;
        }
    }
})

export default AppSlice.reducer;
export const {setLoginState, setActivePath} = AppSlice.actions;