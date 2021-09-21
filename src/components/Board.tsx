import { Container, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../constants";
import { BoardState, enhanceScore, reset } from "../slices/board-slice";
import { RootType } from "../store";
import { useInterval } from "../libs/utils";
import '../styles/Board.scss';

enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT'
}

const CURRENT_POSITION = [2, 2];
const TARGET_POSITION = [10, 10];

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

function equalArray<T>(a: T[], b: T[]): boolean {
    const len1 = a.length, len2 = b.length;
    if (len1 !== len2) return false;

    for (let i = 0; i < len1; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

export const Board = () => {
    let { score } = useSelector<RootType>(state => state.Board) as BoardState;
    const dispatch = useDispatch();
    const board: number[][] = Array(Constants.SIZE_BOARD);
    const [currentPosition, setCurrentPosition] = useState(CURRENT_POSITION);
    const [targetPosition, setTargetPosition] = useState(TARGET_POSITION);
    const [direction, setDirection] = useState(Direction.Down);
    const [delay, setDelay] = useState(true);

    console.log(`current row: ${currentPosition[0]}`);
    console.log(`current col: ${currentPosition[1]}`);
    console.log(`target row: ${targetPosition[0]}`);
    console.log(`target col: ${targetPosition[1]}`);
    console.log(`direction: ${direction}`);
    console.log(`delay: ${delay}`);

    const move = () => {
        if (delay) return;

        const pos = [...currentPosition];
        switch (direction) {
                case Direction.Up:
                    pos[0]--;
                    break;
                case Direction.Down:
                    pos[0]++;
                    break;
                case Direction.Left:
                    pos[1]--;
                    break;
                case Direction.Right:
                    pos[1]++;
                    break;
            }

            setCurrentPosition([...pos]);
            checkBoardState();
    }

    useInterval(move, 120);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
             document.removeEventListener('keydown',  handleKeyDown);
        }
    }, []);

    const initializeBoard = (): void => { for (let i = 0; i < Constants.SIZE_BOARD; i++) board[i] = Array(Constants.SIZE_BOARD).fill(0); }
    initializeBoard();

    const getCellClassName = (rowIdx: number, colIdx: number): string => {
        let className = `cell-board ${rowIdx}-${colIdx}`;
        if (rowIdx === currentPosition[0] && colIdx === currentPosition[1]) className += ' current';
        else if (rowIdx === targetPosition[0] && colIdx === targetPosition[1]) className += ' target';

        return className;
    }

    const checkBoardState = () => {
        if (equalArray(currentPosition, targetPosition)) {
            dispatch(enhanceScore());
            setTargetPosition(setTargets(currentPosition[0], currentPosition[1]));
        } else if (currentPosition[0] <= 0 || currentPosition[0] >= Constants.SIZE_BOARD - 1 
                                            || currentPosition[1] <= 0 || currentPosition[1] >= Constants.SIZE_BOARD - 1) {
            dispatch(reset());
            setDelay(true);
            setCurrentPosition(CURRENT_POSITION);
            setTargetPosition(TARGET_POSITION);
        }
    }

    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
        switch (e.key) {
            case 'ArrowUp':
                setDirection(Direction.Up);
                break;
            case 'ArrowDown':
                setDirection(Direction.Down);
                break;
            case 'ArrowLeft':
                setDirection(Direction.Left);
                break;
            case 'ArrowRight':
                setDirection(Direction.Right);
                break;
        }

        if (delay) setDelay(false);
    }

return (
    <Container className='main-container'>
        <Grid item xs={12}>
            <h1>Score: {score}</h1>
        </Grid>

        <Grid item xs={12} id='grid-board'>{
            board.map((row, rowIdx) =>
            <div key={rowIdx} className='row-board'>{
                row.map((cell, colIdx) => {
                    let className = getCellClassName(rowIdx, colIdx);
                    return <div key={colIdx} className={className} tabIndex={0}></div>
                })}</div>
            )}
        </Grid>
    </Container>
)}