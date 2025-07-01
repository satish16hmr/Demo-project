import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/reducers/auth.reducer.jsx";
import postReducer from "../store/reducers/post.reducer.jsx";
import userReducer from "../store/reducers/user.reducer.jsx";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
  },
});
