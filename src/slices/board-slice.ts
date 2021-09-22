import { createSlice } from "@reduxjs/toolkit";

export interface BoardState {
    score: number,
    topScores: number[]
}

const initialState: BoardState = {
    score: 0,
    topScores: []
}

const modifyTopScores = (arr: number[], x: number) : number[] => {
    let isAdded = false;

    for (let i = 0, n = arr.length; i < n; i++) {
        if (x >= arr[i]) {
            arr.splice(i, 0, x);
            isAdded = true;
            break;
        }
    }

    if (isAdded) {
        if (arr.length > 10) arr.pop();
    } else {
        if (arr.length < 10) arr.push(x);
    }

    return arr;
}

const slice = createSlice({
    name: 'board',
    initialState: initialState,
    reducers: {
        enhanceScore: (state: BoardState) => {
            return {
                ...state,
                score: state.score + 1,
                topScores: modifyTopScores([...state.topScores], state.score + 1)
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