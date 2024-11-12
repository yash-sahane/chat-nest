import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/AuthSlice";
import chatSlice from "../slices/ChatSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
