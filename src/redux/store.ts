import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./reducers/article";
import userReducer from "./reducers/user";
import adminReducer from "./reducers/admin";

export const store = configureStore({
  reducer: {
    articles: articleReducer,
    user: userReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
