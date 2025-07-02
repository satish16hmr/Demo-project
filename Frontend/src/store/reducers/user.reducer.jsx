import { createSlice } from "@reduxjs/toolkit";
import {
  updateProfile,
  deleteProfile,
  searchUsers,
  fetchNotifications,
  deleteNotification,
  fetchAllUsers,
  followUser,
  unfollowUser,
  fetchFollowers,
  fetchFollowing,
} from "../actions/user.action";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    followers: [],
    following: [],
    followingIds: [],
    searchedUsers: [],
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchedUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedUsers = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(followUser.fulfilled, (state, action) => {
        if (!state.followingIds.includes(action.payload)) {
          state.followingIds.push(action.payload);
        }
      })

      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followingIds = state.followingIds.filter(
          (id) => id !== action.payload
        );
      })

      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })

      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
        // Update followingIds to match the fetched following list
        state.followingIds = action.payload
          .map((f) => f.Following?.id)
          .filter((id) => !!id);
      });
  },
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
