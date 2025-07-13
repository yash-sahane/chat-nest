import { setSelectedChatData } from "@/slices/ChatSlice";
import { RootState } from "@/store/store";
import { ApiResponse, DMProfile } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/chat`,
        { id },
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
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getChannelMessages = createAsyncThunk(
  "chat/getChannelChatMessages",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/chat/getChannelMessages`,
        { id },
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
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getChannels = createAsyncThunk(
  "channel/getChannels",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/getChannels`,
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

export const getDMProfiles = createAsyncThunk(
  "chat/getDMProfiles",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/profiles/getProfilesForDMList`,
        { withCredentials: true }
      );
      if (data.success) {
        const state = getState() as RootState;
        const selectedChatData = state.chat.selectedChatData;
        const DMProfiles: DMProfile[] = data.data;
        DMProfiles.map((dmProfile) => {
          if (dmProfile._id === selectedChatData?._id) {
            dispatch(
              setSelectedChatData({
                ...selectedChatData,
                status: dmProfile.status,
              })
            );
          }
        });
        return data;
      } else {
        rejectWithValue(data.message);
      }
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getUserChannels = createAsyncThunk(
  "channel/getUserChannels",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/getUserChannels`,
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

export const createChannel = createAsyncThunk(
  "channel/createChannel",
  async ({ formData }: { formData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiResponse>(
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
