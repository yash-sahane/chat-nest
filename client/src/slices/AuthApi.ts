import { ApiResponse } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/user`,
        { withCredentials: true }
      );
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);

      return rejectWithValue(e.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/user/signup`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/user/logout`,
        { withCredentials: true }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const setup = createAsyncThunk(
  "/auth/setup",
  async ({ formData }: { formData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/user/setup`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);
