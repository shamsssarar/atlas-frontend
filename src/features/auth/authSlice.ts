import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our User state
interface AuthState {
  uid: string | null;
  email: string | null;
  role: 'ATHLETE' | 'COACH' | 'ADMIN' | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  uid: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when Firebase successfully logs the user in
    setCredentials: (
      state,
      action: PayloadAction<{ uid: string; email: string; role?: string }>
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      // Default to ATHLETE if no role is passed yet (we will fetch this from the backend later)
      state.role = (action.payload.role as AuthState['role']) || 'ATHLETE'; 
      state.isAuthenticated = true;
    },
    // Called on logout
    logOut: (state) => {
      state.uid = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;