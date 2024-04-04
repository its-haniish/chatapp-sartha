import { reducer } from './reducers.js';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        reducer
    }
})

export default store;