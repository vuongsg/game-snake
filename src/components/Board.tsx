import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

const SNAKE_POSITION_INIT = [2, 2];
const FOOD_POSITION_INIT = [10, 10];

const useStyles = makeStyles(theme => ({
    snake: {
        backgroundImage: `url('${process.env.PUBLIC_URL + '/img/snake-icon.png'}')`,
        backgroundSize: 'cover'
    },
    food: {
        backgroundImage: `url('${process.env.PUBLIC_URL + '/img/food-icon.png'}')`,
        backgroundSize: 'cover'
    },
    ul: {
        listStyle: 'none'
    }
}));

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
    let { score, topScores } = useSelector<RootType>(state => state.Board) as BoardState;
    const classes = useStyles();
    const dispatch = useDispatch();
    const board: number[][] = Array(Constants.SIZE_BOARD);
    const [snake, setSnake] = useState(SNAKE_POSITION_INIT);
    const [food, setFood] = useState(FOOD_POSITION_INIT);
    const [direction, setDirection] = useState(Direction.Down);
    const [delay, setDelay] = useState(true);

    const move = () => {
        if (delay) return;

        const pos = [...snake];
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

            setSnake([...pos]);
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
        if (equalArray([rowIdx, colIdx], snake)) className += ` ${classes.snake}`;
        else if (equalArray([rowIdx, colIdx], food)) className += ` ${classes.food}`;

        return className;
    }

    const checkBoardState = () => {
        if (equalArray(snake, food)) {
            dispatch(enhanceScore());
            setFood(setTargets(snake[0], snake[1]));
        } else if (snake[0] <= 0 || snake[0] >= Constants.SIZE_BOARD - 1 
                                 || snake[1] <= 0 || snake[1] >= Constants.SIZE_BOARD - 1) {
            dispatch(reset());
            setDelay(true);
            setSnake(SNAKE_POSITION_INIT);
            setFood(FOOD_POSITION_INIT);
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
        <Grid container>
            <Grid item sm={12} md={9}>
                <Grid container>
                    <Grid item xs={12} style={{padding: 5}}>
                        <h1>Score: {score}</h1>
                    </Grid>

                    <Grid item xs={12} id='grid-board'>{
                        board.map((row, rowIdx) =>
                            <div key={rowIdx} className='row-board'>{
                                row.map((cell, colIdx) => {
                                    let className = getCellClassName(rowIdx, colIdx);
                                    return <div key={colIdx} className={className} tabIndex={0}></div>
                                })}
                            </div>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={3} style={{padding: 5}}>
                <h2>Top Scores</h2>
                <ul className={classes.ul}>{
                        topScores.map((s, i) => <li>
                                                    <h3>{i + 1}. <span style={{ color: 'gray', marginRight: 3 }}>{s} {s > 1 ? 'goals' : 'goal'}</span>
                                                    </h3></li>)
                    }
                </ul>
            </Grid>
        </Grid>
    </Container>
)}