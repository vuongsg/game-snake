import { createSlice } from "@reduxjs/toolkit";

export interface BoardState {
    score: number
}

const initialState: BoardState = {
    score: 0,
}

const slice = createSlice({
    name: 'board',
    initialState: initialState,
    reducers: {
        enhanceScore: (state: BoardState) => {
            return {
                ...state,
                score: state.score + 1
            }
        },
        reset: (state: BoardState) => {
            return {
                ...state,
                score: 0
            }
        }
    }
});

export const { enhanceScore, reset } = slice.actions;
export default slice.reducer;