import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  getUserFeed,
  getAllPosts,
  updatePost,
  deletePost,
  toggleLike,
  commentOnPost,
  getPostComments,
  deleteComment,
  updateComment,
  getLikesForPost,
} from "../actions/post.action";

const initialState = {
  posts: [],
  commentsByPostId: {},
  likesByPostId: {},
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostState: () => initialState,
    setCommentsByPostId: (state, action) => {
      const { postId, comments } = action.payload;
      state.commentsByPostId[postId] = comments;
    },
  },
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(getUserFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.map((post) => ({
          ...post,
          liked: post.liked || false,
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
        }));
      })
      .addCase(getUserFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load feed";
      })

      // All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load posts";
      })

      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
      })

      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload.id);
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, likesCount } = action.payload;
        const post = state.posts.find((p) => p.id === parseInt(postId));
        if (post) {
          post.liked = liked;
          post.likesCount = likesCount;
        }
      })

      // Get Likes For Post
      .addCase(getLikesForPost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        state.likesByPostId[postId] = likes.map((like) => like.user);
      })

      // Add Comment
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const comment = action.payload;
        const postId = comment.postId;
        if (!state.commentsByPostId[postId])
          state.commentsByPostId[postId] = [];
        state.commentsByPostId[postId].push(comment);
        const post = state.posts.find((p) => p.id === postId);
        if (post) post.commentsCount += 1;
      })

      // Get Comments
      .addCase(getPostComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments;
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId } = action.payload;
        for (const postId in state.commentsByPostId) {
          state.commentsByPostId[postId] = state.commentsByPostId[
            postId
          ].filter((c) => c.id !== commentId);
        }
        const post = state.posts.find((p) =>
          state.commentsByPostId[p.id]?.some((c) => c.id === commentId)
        );
        if (post) post.commentsCount -= 1;
      })

      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        for (const postId in state.commentsByPostId) {
          const index = state.commentsByPostId[postId].findIndex(
            (c) => c.id === updated.id
          );
          if (index !== -1) {
            state.commentsByPostId[postId][index] = updated;
          }
        }
      });
  },
});

export const { clearPostState } = postSlice.actions;
export default postSlice.reducer;
