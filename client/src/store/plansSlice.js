import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

export const fetchPlans = createAsyncThunk('plans/fetchPlans', async (_, { getState }) => {
    const { user } = getState().auth;
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
});

export const createPlan = createAsyncThunk('plans/createPlan', async (planData, { getState }) => {
    const { user } = getState().auth;
    if (!user) throw new Error("User required");

    const { data, error } = await supabase
        .from('user_plans')
        .insert([{
            ...planData,
            user_id: user.id
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
});

export const deletePlan = createAsyncThunk('plans/deletePlan', async (planId, { getState }) => {
    const { user } = getState().auth;
    if (!user) throw new Error("User required");

    const { error } = await supabase
        .from('user_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

    if (error) throw error;
    return planId;
});

const initialState = {
    plans: [],
    loading: false,
    error: null
};

const plansSlice = createSlice({
    name: 'plans',
    initialState,
    reducers: {
        clearPlans: (state) => {
            state.plans = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.plans.unshift(action.payload);
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.plans = state.plans.filter(p => p.id !== action.payload);
            });
    }
});

export const { clearPlans } = plansSlice.actions;
export default plansSlice.reducer;
