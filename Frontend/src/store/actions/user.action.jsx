import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../libs/axios';

export const searchUsers = createAsyncThunk(
  'users/search',
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
  'users/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/getNotifications');
      return res.data.notifications;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'users/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/deleteNotification/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
