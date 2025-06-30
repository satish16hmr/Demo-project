import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../libs/axios';

export const signup = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/signup', formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data.user || res.data.data) {
        localStorage.setItem('user', JSON.stringify(res.data.user || res.data.data));
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);


export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch profile failed');
    }
  }
);


export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { user, token } = getState().auth;
      const res = await api.put(`/users/profile/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'auth/deleteProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user, token } = getState().auth;
      await api.delete(`/users/delete/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await api.post('/users/logout', {}, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);