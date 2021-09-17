import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./slices/board-slice";

const store = configureStore({
    reducer: {
        Board: boardSlice
    }
});

export type RootType = ReturnType<typeof store.getState>;
export default store;