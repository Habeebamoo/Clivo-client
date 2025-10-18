import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./reducers/article_reducer"
import userReducer from "./reducers/user_reducer"
import adminReducer from "./reducers/admin_reducer"

const store = configureStore({
  reducer: {
    articles: articleReducer,
    user: userReducer,
    admin: adminReducer
  }
})

export default store