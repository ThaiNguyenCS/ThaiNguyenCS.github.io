import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    position: {
        x: 0, y: 0
    },
    toggled: false,
    selectedWord: "",
}

const ContextDictSlice = createSlice({
    name: "contextDict",
    initialState: initialState,
    reducers: {
        resetDict(state, action)
        {
            return initialState;
        },

        openDict(state, action)
        {
            console.log(action)
            state.toggled = true;
            state.position.x = action.payload.x;
            state.position.y = action.payload.y;
            state.selectedWord = action.payload.selectedWord;
        }
    }
})

export default ContextDictSlice.reducer;
export const {resetDict, openDict} = ContextDictSlice.actions;