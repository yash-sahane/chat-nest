import { Channel, ChannelChatMsg, ChatMsg, DMProfile, User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createChannel,
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
  selectedChannelMessages: ChatMsg[] | [];
  channels: Channel[] | [];
  DMProfiles: DMProfile[] | [];
  loading: boolean;
  chatView: "person" | "channel";
};

const initialState: InitialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  selectedChannelMessages: [],
  channels: [],
  DMProfiles: [],
  loading: false,
  chatView: "person",
};

const ChatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
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
          sender: action.payload.sender._id,
          recipient: action.payload.recipient
            ? action.payload.recipient._id
            : undefined,
        },
      ];
    },
    setSelectedChannelMessages: (state, action) => {
      state.selectedChatMessages = [
        ...state.selectedChatMessages,
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
        state.DMProfiles = action.payload.data;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.selectedChatMessages = action.payload;
        state.loading = false;
      })
      // getAllChannels
      .addCase(getChannels.fulfilled, (state, action) => {
        state.channels = action.payload.data;
      })
      // getUserChannels
      .addCase(getUserChannels.fulfilled, (state, action) => {
        state.channels = action.payload.data;
      })
      // create channel
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
      })
      // getChannelChatMessages
      .addCase(getChannelMessages.fulfilled, (state, action) => {
        state.selectedChatMessages = action.payload;
      });
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChannelMessages,
  setChatView,
} = ChatSlice.actions;

export default ChatSlice.reducer;
