import User from "@/types/user";
import { ProfileThemeKeys } from "@/utils/profileThemeKeys";
import { createSlice } from "@reduxjs/toolkit";
import { login, logout, signup } from "./AuthApi";

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
  reducers: {},
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
      });
  },
});

export default AuthSlice.reducer;
