import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/axios";

export const fetchAllUsers = createAsyncThunk(
  "follow/fetchAllUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, user } = getState().auth;
      const res = await api.get("/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.filter((u) => u.id !== user.id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.post(
        `/users/${id}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.post(
        `/users/${id}/unfollow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}/followers`);
      return res.data.followers || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch followers"
      );
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}/followings`);
      return res.data.following || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch following"
      );
    }
  }
);
