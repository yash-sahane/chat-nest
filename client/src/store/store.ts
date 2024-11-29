import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/AuthSlice";
import chatSlice from "../slices/ChatSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
