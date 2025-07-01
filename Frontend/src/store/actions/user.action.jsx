import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/axios";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { user, token } = getState().auth;
      const res = await api.put(`/users/profile/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user, token } = getState().auth;
      await api.delete(`/users/delete/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/search",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/search?query=${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "users/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/getNotifications");
      return res.data.notifications;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "users/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/deleteNotification/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
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
  "user/followUser",
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
  "user/unfollowUser",
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
  "user/fetchFollowers",
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
  "user/fetchFollowing",
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
