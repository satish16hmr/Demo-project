import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/axios";

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", formData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user || res.data.data) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || res.data.data)
        );
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", formData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch profile failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return (
        res.data.message || "If that email exists, a reset link has been sent."
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong."
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      return res.data.message || "Password reset successful!";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await api.post(
        "/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("token");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);
