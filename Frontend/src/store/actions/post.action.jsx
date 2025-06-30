import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/axios";

//  Create Post
export const createPost = createAsyncThunk(
  "post/create",
  async (formData, { rejectWithValue }) => {
    console.log("Inside createPost thunk", formData);
    try {
      const res = await api.post("/post/Create-Post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.log("Error while creating post", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Feed for Logged-in User (Followed Users)
export const getUserFeed = createAsyncThunk(
  "post/getFeed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/post/getUserLoginFeed");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get All Posts of Specific User
export const getAllPosts = createAsyncThunk(
  "post/getAll",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/post/getAllPosts/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Post
export const updatePost = createAsyncThunk(
  "post/update",
  async ({ postId, formData }, { rejectWithValue }) => {
    console.log("posidupdate", postId);
    try {
      const res = await api.put(`/post/update/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Post
export const deletePost = createAsyncThunk(
  "post/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/post/delete/${postId}`);
      return { id: postId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Like / Unlike Post
export const toggleLike = createAsyncThunk(
  "post/like",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/post/like/${postId}`);
      return {
        postId: res.data.postId,
        liked: res.data.liked,
        likesCount: res.data.likesCount,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Get Likes for a Post
export const getLikesForPost = createAsyncThunk(
  "post/getLikesForPost",
  async (postId, thunkAPI) => {
    try {
      const res = await api.get(`/post/likes/${postId}`);
      return { postId, likes: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


//  Add Comment to Post
export const commentOnPost = createAsyncThunk(
  "post/comment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/post/posts/${postId}/comment`, { text });
      return res.data.comment;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//  Get Comments of a Post
export const getPostComments = createAsyncThunk(
  "post/getPostComments",
  async (postId, thunkAPI) => {
    try {
      const response = await api.get(`/post/comments/${postId}`);
      return { postId, comments: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/post/posts/${commentId}/delete`);
      return { commentId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  "post/updateComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/post/posts/${commentId}/update`, { text });
      return res.data.comment;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
