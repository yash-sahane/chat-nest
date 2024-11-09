import { ApiResponse } from "@/types/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosResponse } from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      const { data } = response;
      console.log(data);

      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
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
      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/user/signup`,
        { email, password },
        { withCredentials: true }
      );

      console.log(data);

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/user/logout`,
        { withCredentials: true }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
