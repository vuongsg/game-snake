import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Constants } from "../constants";

export interface BoardState {
    score: number,
    board: boolean[][]
}

const initialState: BoardState = {
    score: 0,
    board: Array(Constants.SIZE_BOARD)
}

for (let i = 0; i < Constants.SIZE_BOARD; i++) initialState.board[i] = Array(15).fill(false);

const slice = createSlice({
    name: 'board',
    initialState: initialState,
    reducers: {
        
    }
});

export default slice.reducer;