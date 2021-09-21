import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Constants } from "../constants";

export enum Direction {
    None ='NONE',
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT'
}

export interface BoardState {
    score: number,
    currentRow: number,
    currentCol: number,
    targetRow: number,
    targetCol: number,
    direction: Direction,
    isDelayed: boolean
}

const initialState: BoardState = {
    score: 0,
    currentRow: 2,
    currentCol: 2,
    targetRow: 10,
    targetCol: 10,
    direction: Direction.Down,
    isDelayed: true
}

/**
 * Return [targetRow, targetCol]
 * @param currentRow 
 * @param currentCol 
 */
const setTargets = (currentRow: number, currentCol: number): [number, number] => {
    let targetRow = -1, targetCol = -1;

    do {
        targetRow = Math.floor(Math.random() * (Constants.SIZE_BOARD - 1));
        targetCol = Math.floor(Math.random() * (Constants.SIZE_BOARD - 1));

        if (targetRow === 0) targetRow = 1;
        else if (targetRow === Constants.SIZE_BOARD - 1) targetRow = Constants.SIZE_BOARD - 2;

        if (targetCol === 0) targetCol = 1;
        else if (targetCol === Constants.SIZE_BOARD - 1) targetCol = Constants.SIZE_BOARD - 2;
    } while (currentRow === targetRow && currentCol === targetCol);

    return [targetRow, targetCol];
}

const slice = createSlice({
    name: 'board',
    initialState: initialState,
    reducers: { //PayloadAction<[currentRow, currentCol, targetRow, targetCol]>
        enhanceScore: (state: BoardState, action: PayloadAction<[number, number, number, number]>) => {
            const targets = setTargets(action.payload[0], action.payload[1]);

            return {
                ...state,
                score: state.score + 1,
                targetRow: targets[0],
                targetCol: targets[1]
            }
        },
        reset: (state: BoardState) => {
            return {
                ...state,
                score: 0,
                currentRow: 2,
                currentCol: 2,
                targetRow: 10,
                targetCol: 10,
                direction: Direction.None,
                isDelayed: true
            }
        },
        changeDirection: (state: BoardState, action: PayloadAction<Direction>) => {
            return {
                ...state,
                direction: action.payload
            }
        },
        changePosition: (state: BoardState, action: PayloadAction<[number, number]>) => {
            return {
                ...state,
                currentRow: action.payload[0],
                currentCol: action.payload[1],
            }
        },
        start: (state: BoardState, action: PayloadAction<Direction>) => {
            return {
                ...state,
                isDelayed: false,
                direction: action.payload
            }
        }
    }
});

export const { enhanceScore, reset, changeDirection, changePosition, start } = slice.actions;
export default slice.reducer;