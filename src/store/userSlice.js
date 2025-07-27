import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabase";
import { showSnackbar } from "./snackbarSlice";

// src/features/auth/authSlice.js

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ formData }, { rejectWithValue,dispatch  }) => {
    try {
      // 1. Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email:formData?.email,
        password: formData?.password,
        options: {
          data: {
            first_name: formData?.FirstName,
            last_name: formData?.lastName,
            role: formData?.role, // Default role
          },
        },
      });
      if (error) {
        dispatch(showSnackbar({ message: error.message, severity: 'error' }));
        throw error;
      }



      // Fetch user role from profiles table
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();
        dispatch(showSnackbar({ message: `Welcome back ${profile?.first_name}`, severity: 'success' }));
      return {
        user: profile,
        role: profile?.role || "student", // Default role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
      try {

        const { error } = await supabase.auth.signOut();
        if (error) throw error;

      
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData }, { rejectWithValue,dispatch }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData?.email,
        password: formData?.password,
      });
      if (error) {
        dispatch(showSnackbar({ message: error.message, severity: 'error' }));
        throw error;
      }

      // Fetch user role from profiles table
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

        dispatch(showSnackbar({ message: `Welcome back ${profile?.first_name}`, severity: 'success' }));
      return {
        user: profile,
        role: profile?.role || "student", // Default role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for session check
export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue,dispatch }) => {

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) throw new Error("No active session");

      // Fetch user role
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

        console.log("User profile:", profile);
        dispatch(showSnackbar({ message: `Welcome back ${profile?.first_name}`, severity: 'success' }));
      return {
        user: profile,
        role: profile?.role || "student",
      };
    } catch (error) {
      console.error("Session check error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    status: "idle",
    isInitialized: false, // Track initialization
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isInitialized = true;
      })
      .addCase(checkSession.rejected, (state) => {
        state.isInitialized = true;
      }).addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      }).addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.role = null;
      }).addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export default authSlice.reducer;
