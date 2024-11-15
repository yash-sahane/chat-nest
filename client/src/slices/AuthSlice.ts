import { User } from "@/types";
import { ProfileThemeKeys } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout, setup, signup } from "./AuthApi";

type InitialState = {
  user: User | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  activeProfileTheme: ProfileThemeKeys;
  // error: string | null;
};

const initialState: InitialState = {
  user: undefined,
  loading: false,
  isAuthenticated: false,
  activeProfileTheme: "violet",
  // error: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveProfileTheme: (state, action) => {
      state.activeProfileTheme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      //signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      })
      //logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = undefined;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(setup.pending, (state) => {
        state.loading = true;
      })
      .addCase(setup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(setup.rejected, (state) => {
        state.loading = false;
      })
      // fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setActiveProfileTheme } = AuthSlice.actions;

export default AuthSlice.reducer;
