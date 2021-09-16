import { ReactElement } from "react";
import { Constants } from "../constants";
import { Board } from "./Board";

export const Snake = (): ReactElement => {
    let targetRow = Math.floor(Math.random() * Constants.SIZE_BOARD);
    let targetCol = Math.floor(Math.random() * Constants.SIZE_BOARD);

    return (
        <div>
            <Board targetRow={targetRow} targetCol={targetCol} />
        </div>
    )
}