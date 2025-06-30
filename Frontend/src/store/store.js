import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/redusers/auth.reduser.jsx";
import followReducer from "../store/redusers/follow.reduser.jsx";
import postReducer from "../store/redusers/post.reduser.jsx";
import userReducer from "../store/redusers/user.reduser.jsx";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    follow: followReducer,
    post: postReducer,
    user: userReducer,
  },
});
