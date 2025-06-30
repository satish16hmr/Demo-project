import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllUsers,
  followUser,
  unfollowUser,
  fetchFollowers,
  fetchFollowing,
} from "../actions/follow.action.jsx";

const followSlice = createSlice({
  name: "follow",
  initialState: {
    users: [],
    followers: [],
    following: [],
    loading: false,
    error: null,
    followingIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followingIds.push(action.payload);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followingIds = state.followingIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      // .addCase(fetchFollowing.fulfilled, (state, action) => {
      //   state.following = action.payload;
      //   state.followingIds = action.payload.map(f => f.Following.id);
      // });
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
        state.followingIds = action.payload.map((f) => f.Following.id);
      });
  },
});

export default followSlice.reducer;
