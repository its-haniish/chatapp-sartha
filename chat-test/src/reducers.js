import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    name: "",
    title: "",
};

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase('join', (state, action) => {
            const { name, title } = action.payload;
            state.name = name;
            state.title = title;
        })
});
