import { Container, Grid } from "@material-ui/core";
import React, { ReactElement, useRef } from "react";
import { useSelector } from "react-redux";
import { Constants } from "../constants";
import { BoardState } from "../slices/board-slice";
import { RootType } from "../store";
import '../styles/Board.scss';

export interface BoardParameter {
    targetRow: number;
    targetCol: number;
}

export const Board: React.FC<BoardParameter> = (props) => {
    const score = (useSelector<RootType>(state => state.Board) as BoardState).score;
    const board = (useSelector<RootType>(state => state.Board) as BoardState).board;

    return (
        <Container className='main-container'>
            <Grid item xs={12}>
                <h1>Score: {score}</h1>
            </Grid>

            <Grid container direction='row' id='grid-board'>{
                <Grid item lg={12}>{
                    board.map((row, idx) =>
                    <div className='row-board'>{
                        row.map((col, i) =>
                            <div className='cell-board'></div>
                    )}</div>
                )}
                </Grid>
            }
            </Grid>
        </Container>
    )
}