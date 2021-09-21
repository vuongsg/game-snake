import { Container, Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Constants } from "../constants";
import { BoardState, Direction, enhanceScore, reset, changeDirection, changePosition, start } from "../slices/board-slice";
import { RootType } from "../store";
import '../styles/Board.scss';

export const Board = () => {
    let { score, currentRow, currentCol, targetRow, targetCol, direction, isDelayed } = useSelector<RootType>(state => state.Board) as BoardState;
    const dispatch = useDispatch();
    const board: number[][] = Array(Constants.SIZE_BOARD);

    console.log(`current row: ${currentRow}`);
    console.log(`current col: ${currentCol}`);
    console.log(`target row: ${targetRow}`);
    console.log(`target col: ${targetCol}`);
    console.log(`direction: ${direction}`);
    console.log(`delay: ${isDelayed}`);

    const timeout = setInterval(() => {
        if (isDelayed || direction === Direction.None) return;

        switch (direction) {
                case Direction.Up:
                    currentRow--;
                    break;
                case Direction.Down:
                    currentRow++;
                    break;
                case Direction.Left:
                    currentCol--;
                    break;
                case Direction.Right:
                    currentCol++;
                    break;
            }

            checkBoardState();
    }, 120);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
             document.removeEventListener('keydown',  handleKeyDown);
             clearInterval(timeout);
        }
    }, []);

    /* useEffect(() => {
        const timeout = setInterval(() => {
            if (isDelayed || direction === Direction.None) return;

        switch (direction) {
                case Direction.Up:
                    if (currentRow > 0) currentRow--;
                    break;
                case Direction.Down:
                    if (currentRow < Constants.SIZE_BOARD) currentRow++;
                    break;
                case Direction.Left:
                    if (currentCol > 0) currentCol--;
                    break;
                case Direction.Right:
                    if (currentCol < Constants.SIZE_BOARD) currentCol++;
                    break;
            }

            checkBoardState();
        }, 120);

        return () => clearInterval(timeout);
    }, []); */

    const initializeBoard = (): void => { for (let i = 0; i < Constants.SIZE_BOARD; i++) board[i] = Array(Constants.SIZE_BOARD).fill(0); }
    initializeBoard();

    const getCellClassName = (rowIdx: number, colIdx: number): string => {
        let className = `cell-board ${rowIdx}-${colIdx}`;
        if (rowIdx === currentRow && colIdx === currentCol) className += ' current';
        else if (rowIdx === targetRow && colIdx === targetCol) className += ' target';

        return className;
    }

    const checkBoardState = () => {
        if (currentRow >= 0 && currentRow < Constants.SIZE_BOARD && currentCol >= 0 && currentCol < Constants.SIZE_BOARD)
            dispatch(changePosition([currentRow, currentCol]));

        if (currentRow === targetRow && currentCol === targetCol) {
            dispatch(enhanceScore([currentRow, currentCol, targetRow, targetCol]));
        } else if (currentRow <= 0 || currentRow >= Constants.SIZE_BOARD - 1 || currentCol <= 0 || currentCol >= Constants.SIZE_BOARD - 1) {
            dispatch(reset());
        }
    }

    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
        switch (e.key) {
            case 'ArrowUp':
                direction = Direction.Up;
                break;
            case 'ArrowDown':
                direction = Direction.Down;
                break;
            case 'ArrowLeft':
                direction = Direction.Left;
                break;
            case 'ArrowRight':
                direction = Direction.Right;
                break;
        }

        if (isDelayed) dispatch(start(direction));
        else dispatch(changeDirection(direction));
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