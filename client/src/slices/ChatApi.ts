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

export const getChannelChatMessages = createAsyncThunk(
  "chat/getChannelChatMessages",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/channel`,
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
  "channel/getChannels",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/getChannels`,
        { withCredentials: true }
      );
      if (data.success) {
        console.log(data);

        return data;
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

export const getUserChannels = createAsyncThunk(
  "channel/getUserChannels",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/getUserChannels`,
        { withCredentials: true }
      );
      if (data.success) {
        console.log(data);

        return data;
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
  "channel/createChannel",
  async ({ formData }: { formData: FormData }, { rejectWithValue }) => {
    try {
      console.log(formData);

      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/create`,
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
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.mesage);
    }
  }
);
