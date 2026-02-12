import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Async thunks for Supabase integration
// Note: These will fail if tables don't exist yet, but we'll structure them correctly.
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async (planId = null, { getState }) => {
    const { user } = getState().auth;
    if (!user) return [];

    let query = supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

    if (planId) {
        query = query.eq('plan_id', planId);
    } else {
        query = query.is('plan_id', null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
});

export const addHabit = createAsyncThunk('habits/addHabit', async (habit, { getState }) => {
    const { user } = getState().auth;
    if (!user) {
        // Fallback for demo/offline if needed, or just error
        throw new Error("User must be logged in");
    }

    const { data, error } = await supabase
        .from('habits')
        .insert([{
            ...habit,
            user_id: user.id,
            // created_at is auto
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
});

// For toggle, we interact with habit_logs table
export const toggleHabitCompletion = createAsyncThunk('habits/toggleHabit', async ({ habitId, date }, { getState }) => {
    const { user } = getState().auth;
    if (!user) throw new Error("User required");

    // Check if exists
    const { data: existing } = await supabase
        .from('habit_logs')
        .select('id')
        .eq('habit_id', habitId)
        .eq('date', date)
        .eq('user_id', user.id)
        .single();

    if (existing) {
        // Delete
        await supabase.from('habit_logs').delete().eq('id', existing.id);
        return { action: 'removed', habitId, date };
    } else {
        // Insert
        await supabase.from('habit_logs').insert({
            habit_id: habitId,
            user_id: user.id,
            date: date,
            completed: true
        });
        return { action: 'added', habitId, date };
    }
});

// Fetch logs (history)
export const fetchHabitLogs = createAsyncThunk('habits/fetchLogs', async (_, { getState }) => {
    const { user } = getState().auth;
    if (!user) return {};

    const { data, error } = await supabase
        .from('habit_logs')
        .select('date, habit_id')
        .eq('user_id', user.id);

    if (error) throw error;

    // Transform to map: { 'YYYY-MM-DD': ['habitId1', 'habitId2'] }
    const history = {};
    data.forEach(log => {
        if (!history[log.date]) history[log.date] = [];
        history[log.date].push(log.habit_id);
    });
    return history;
});

// Delete habit
export const deleteHabit = createAsyncThunk('habits/deleteHabit', async (habitId, { getState }) => {
    const { user } = getState().auth;
    if (!user) throw new Error("User required");

    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id);

    if (error) throw error;
    return habitId;
});

const initialState = {
    habits: [],
    history: {},
    loading: false,
    error: null
};

const habitsSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        // Keep local reducers if we want optimistic UI before thunks resolve, 
        // but for now let's rely on standard async flow or just clean cleanup.
        clearHabits: (state) => {
            state.habits = [];
            state.history = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.habits = action.payload || [];
            })
            .addCase(addHabit.fulfilled, (state, action) => {
                state.habits.push(action.payload);
            })
            .addCase(fetchHabitLogs.fulfilled, (state, action) => {
                state.history = action.payload;
            })
            .addCase(deleteHabit.fulfilled, (state, action) => {
                state.habits = state.habits.filter(h => h.id !== action.payload);
            })
            .addCase(toggleHabitCompletion.fulfilled, (state, action) => {
                const { action: type, habitId, date } = action.payload;
                if (!state.history[date]) state.history[date] = [];

                if (type === 'removed') {
                    state.history[date] = state.history[date].filter(id => id !== habitId);
                } else {
                    state.history[date].push(habitId);
                }
            });
    }
});

export const { clearHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
