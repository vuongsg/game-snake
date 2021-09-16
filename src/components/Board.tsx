import { Grid } from "@material-ui/core";
import React, { ReactElement, useRef } from "react";
import { Constants } from "../constants";
import '../styles/Board.scss';

export interface BoardParameter {
    targetRow: number;
    targetCol: number;
}

export const Board: React.FC<BoardParameter> = (props) => {
    let initialRowsBoard: ReactElement[] = [];
    const rowsBoard = useRef(initialRowsBoard);

    const drawBoard = () => {
        rowsBoard.current = [];
        const classNames = `cell-board`;
        const rowClassNames = ``;

        for (let i = 0; i < Constants.SIZE_BOARD; i++) {
            const cells: ReactElement[] = [];

            for (let k = 0; k < Constants.SIZE_BOARD; k++) {
                const cell = React.createElement('div', {className: classNames});
                cells.push(cell);
            }

            rowsBoard.current.push(React.createElement('div', { classNames: rowClassNames }, cells));
        }
    }

    drawBoard();    //draw board at initialization

    return (
        <Grid id='grid-board'>
            {rowsBoard.current}
        </Grid>
    )
}