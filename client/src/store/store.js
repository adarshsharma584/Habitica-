import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import plansReducer from './plansSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        habits: habitsReducer,
        plans: plansReducer,
    },
});
