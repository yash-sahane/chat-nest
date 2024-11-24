import { ChatMsg, Message, User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { getChatMessages } from "./ChatApi";

type InitialState = {
  selectedChatType: "chat" | "channel" | undefined;
  selectedChatData: User | undefined;
  selectedChatMessages: ChatMsg[] | [];
  loading: boolean;
};

const initialState: InitialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
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
          recipient: action.payload.recipient._id,
        },
      ];
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
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
} = ChatSlice.actions;

export default ChatSlice.reducer;
