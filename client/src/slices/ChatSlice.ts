import { Message, User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  selectedChatType: "chat" | "group" | undefined;
  selectedChatData: User | undefined;
  selectedChatMessages: Message[] | [];
};

const initialState: InitialState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
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
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
} = ChatSlice.actions;

export default ChatSlice.reducer;
