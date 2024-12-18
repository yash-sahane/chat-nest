import { User } from "@/types";
import { ProfileThemeKeys } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout, setup, signup } from "./AuthApi";

type InitialState = {
  user: User | undefined;
  isAuthenticated: boolean;
  activeProfileTheme: ProfileThemeKeys;
};

const initialState: InitialState = {
  user: undefined,
  isAuthenticated: false,
  activeProfileTheme: "violet",
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
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      //signup
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      //logout
      .addCase(logout.fulfilled, (state) => {
        state.user = undefined;
        state.isAuthenticated = false;
      })
      .addCase(setup.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      // fetch user
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      });
  },
});

export const { setActiveProfileTheme } = AuthSlice.actions;

export default AuthSlice.reducer;
