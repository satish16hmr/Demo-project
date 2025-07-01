import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../layout/ProtectedRoute.jsx";
import PublicLayout from "../layout/PublicLayout.jsx";
import PrivateLayout from "../layout/PrivateLayout.jsx";
import Home from "../pages/home.jsx";
import Signup from "../pages/user/auth/signup.jsx";
import Login from "../pages/user/auth/login.jsx";
import Profile from "../pages/user/community/profile.jsx";
import UserProfile from "../pages/user/community/userprofile.jsx";
import ForgotPassword from "../pages/user/auth/forgotpassword.jsx";
import ResetPassword from "../pages/user/auth/resetpassword.jsx";
import Dashboard from "../pages/user/dashboard.jsx";
import Post from "../pages/post/post.jsx";
import FollowUsers from "../views/user/Follow.jsx";
import SearchUser from "../pages/user/community/searchuser.jsx";
import Notifications from "../pages/user/community/notifications.jsx";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "posts", element: <Post /> },
              { path: "follow", element: <FollowUsers /> },
              { path: "search", element: <SearchUser /> },
              { path: "notifications", element: <Notifications /> },
            ],
          },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/:id", element: <UserProfile /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Login />,
  },
]);

export default router;
