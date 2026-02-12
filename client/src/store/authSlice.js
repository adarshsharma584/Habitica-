import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial state from localStorage
const savedSession = JSON.parse(localStorage.getItem('habitica_session'));

const initialState = {
  user: savedSession?.user || null,
  session: savedSession || null,
  isAuthenticated: !!savedSession,
  loading: true, // Start as true to check session
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload;
      state.loading = false;

      if (action.payload) {
        localStorage.setItem('habitica_session', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('habitica_session');
      }
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('habitica_session');
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser, setSession, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
