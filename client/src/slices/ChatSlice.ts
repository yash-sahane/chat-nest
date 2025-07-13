import { Channel, ChannelChatMsg, ChatMsg, DMProfile, User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import {
  getChannelMessages,
  getChannels,
  getChatMessages,
  getDMProfiles,
  getUserChannels,
} from "./ChatApi";

type InitialState = {
  selectedChatType: "chat" | "channel" | undefined;
  selectedChatData: User | Channel | undefined;
  selectedChatMessages: ChatMsg[] | [];
  selectedChannelMessages: ChannelChatMsg[] | [];
  channels: Channel[] | [];
  DMProfiles: DMProfile[] | [];
  chatView: "person" | "channel";
};

const initialState: InitialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  selectedChannelMessages: [],
  channels: [],
  DMProfiles: [],
  chatView: "person",
};

const ChatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    updateUserStatus: (
      state,
      action: {
        payload: {
          userId: string;
          status: "online" | "offline";
        };
      }
    ) => {
      state.DMProfiles = state.DMProfiles.map((profile) =>
        profile._id === action.payload.userId
          ? { ...profile, status: action.payload.status }
          : profile
      );

      console.log(
        state.selectedChatData &&
          "status" in state.selectedChatData &&
          state.selectedChatData._id === action.payload.userId
      );

      if (
        state.selectedChatData &&
        "status" in state.selectedChatData &&
        state.selectedChatData._id === action.payload.userId
      )
        state.selectedChatData =
          state.selectedChatData?._id === action.payload.userId
            ? { ...state.selectedChatData, status: action.payload.status }
            : state.selectedChatData;
    },
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = [
        ...state.selectedChatMessages,
        {
          ...action.payload,
          sender: action.payload.sender ? action.payload.sender._id : undefined,
          recipient: action.payload.recipient
            ? action.payload.recipient._id
            : undefined,
        },
      ];
    },
    setSelectedChannelMessages: (state, action) => {
      state.selectedChannelMessages = [
        ...state.selectedChannelMessages,
        {
          ...action.payload,
          sender: action.payload.sender,
        },
      ];
    },
    setChatView: (state, action) => {
      state.chatView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDMProfiles.fulfilled, (state, action) => {
        state.DMProfiles = action.payload?.data;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.selectedChatMessages = action.payload;
      })
      // getAllChannels
      .addCase(getChannels.fulfilled, (state, action) => {
        state.channels = action.payload.data;
      })
      // getUserChannels
      .addCase(getUserChannels.fulfilled, (state, action) => {
        state.channels = action.payload.data;
      })
      .addCase(getChannelMessages.fulfilled, (state, action) => {
        state.selectedChannelMessages = action.payload;
      });
  },
});

export const {
  updateUserStatus,
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChannelMessages,
  setChatView,
} = ChatSlice.actions;

export default ChatSlice.reducer;
