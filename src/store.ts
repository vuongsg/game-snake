import { configureStore } from "@reduxjs/toolkit";
import snakeSlice from "./slices/snake-slice";

const store = configureStore({
    reducer: {
        Snake: snakeSlice
    }
});

export type RootType = ReturnType<typeof store.getState>;
export default store;