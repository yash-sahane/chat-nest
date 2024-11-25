import { ApiResponse } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/chat`,
        { id },
        { withCredentials: true }
      );

      // console.log(data);

      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getChannels = createAsyncThunk(
  "chat/getChannels",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/chat/getChannels`,
        { withCredentials: true }
      );
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.mesage);
    }
  }
);

export const createChannel = createAsyncThunk(
  "chat/createChannel",
  async (
    { channelName, members }: { channelName: string; members: string[] },
    { rejectWithValue }
  ) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/chat/getChannels`,
        { channelName, members },
        { withCredentials: true }
      );
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.mesage);
    }
  }
);
