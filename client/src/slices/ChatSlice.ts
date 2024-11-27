import { Channel, ChatMsg, Message, User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createChannel,
  getChannelChatMessages,
  getChannels,
  getChatMessages,
  getUserChannels,
} from "./ChatApi";

type InitialState = {
  selectedChatType: "chat" | "channel" | undefined;
  selectedChatData: User | Channel | undefined;
  selectedChatMessages: ChatMsg[] | [];
  channels: Channel[] | [];
  loading: boolean;
};

const initialState: InitialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  channels: [],
  loading: false,
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
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.selectedChatMessages = action.payload;
        state.loading = false;
      })
      .addCase(getChatMessages.rejected, (state) => {
        state.loading = false;
      });
    // getAllChannels
    builder
      .addCase(getChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChannels.fulfilled, (state, action) => {
        // console.log(action.payload);

        state.channels = action.payload.data;
        state.loading = false;
      })
      .addCase(getChannels.rejected, (state) => {
        state.loading = false;
      });
    // getUserChannels
    builder
      .addCase(getUserChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserChannels.fulfilled, (state, action) => {
        // console.log(action.payload);

        state.channels = action.payload.data;
        state.loading = false;
      })
      .addCase(getUserChannels.rejected, (state) => {
        state.loading = false;
      });
    // create channel
    builder
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        // state.channels = action.payload;
        state.loading = false;
      })
      .addCase(createChannel.rejected, (state) => {
        state.loading = false;
      })
      // getChannelChatMessages
      .addCase(getChannelChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChannelChatMessages.fulfilled, (state, action) => {
        state.selectedChatMessages = action.payload;
        state.loading = false;
      })
      .addCase(getChannelChatMessages.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setChannels,
} = ChatSlice.actions;

export default ChatSlice.reducer;
