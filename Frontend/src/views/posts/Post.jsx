import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Tooltip,
  Divider,
  ListItemButton,
  Paper,
} from "@mui/material";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as ChatIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import moment from "moment";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserFeed,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getLikesForPost,
  commentOnPost,
  getPostComments,
  deleteComment,
  updateComment,
} from "../../store/actions/post.action";
import { ToastContainer } from "react-toastify";
import {
  notifyDelete,
  notifyInfo,
  notifySuccess,
} from "../../components/Toastify";
import { useNavigate, Link } from "react-router-dom";

import {
  deepPurple,
  blue,
  pink,
  green,
  orange,
  teal,
} from "@mui/material/colors";

const colors = [
  deepPurple[500],
  blue[500],
  pink[500],
  green[500],
  orange[500],
  teal[500],
];

const getRandomColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export default function PostFeed() {
  const dispatch = useDispatch();
  const { posts, commentsByPostId, likesByPostId } = useSelector(
    (state) => state.post
  );
  const user = useSelector((state) => state.auth.user);

  const [view, setView] = useState("feed");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [commentTextMap, setCommentTextMap] = useState({});
  const [editCommentMap, setEditCommentMap] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserFeed());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setImage(null);
    setImagePreview(null);
    setEditPost(null);
  };

  const handlePostSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (image) formData.append("image", image);

    const action = editPost
      ? updatePost({ postId: editPost.id, formData })
      : createPost(formData);

    dispatch(action).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        notifySuccess(editPost ? "Post updated" : "Post created");
        resetForm();
        setView("feed");
        dispatch(getUserFeed());
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setTitle(post.title || "");
    setDesc(post.description || "");
    setImagePreview(post.image || null);
    setView("create");
  };

  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    dispatch(deletePost(postToDelete)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        notifySuccess("Post deleted");
        setOpenDeleteDialog(false);
        dispatch(getUserFeed());
      }
    });
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId)).then(() => {
      dispatch(getUserFeed());
    });
  };

  const handleOpenLikesDialog = (postId) => {
    dispatch(getLikesForPost(postId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const likes = res.payload.likes;
        const users = likes.map((like) => like.user);
        setSelectedPostLikes(users);
        setSelectedPostId(postId);
        setOpenLikesDialog(true);
      }
    });
  };

  const handleCloseLikesDialog = () => {
    setOpenLikesDialog(false);
    setSelectedPostLikes([]);
    setSelectedPostId(null);
  };

  const toggleCommentsVisibility = (postId) => {
    if (!visibleComments[postId]) {
      dispatch(getPostComments(postId));
    }
    setVisibleComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleComment = (postId) => {
    const text = commentTextMap[postId]?.trim();
    if (text) {
      dispatch(commentOnPost({ postId, text })).then(() => {
        notifySuccess("Comment added");
        dispatch(getPostComments(postId));
        dispatch(getUserFeed());
        setCommentTextMap((prev) => ({ ...prev, [postId]: "" }));
      });
    }
  };

  const handleDeleteComment = (commentId, postId) => {
    dispatch(deleteComment(commentId)).then(() => {
      notifyDelete("Comment deleted");
      dispatch(getPostComments(postId));
      dispatch(getUserFeed());
    });
  };

  const handleUpdateComment = (commentId, postId) => {
    const newText = editCommentMap[commentId]?.trim();
    if (!newText) return;

    dispatch(updateComment({ commentId, text: newText })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        notifySuccess("Comment updated");
        dispatch(getPostComments(postId));
        dispatch(getUserFeed());
        setEditCommentMap((prev) => {
          const { [commentId]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 580, mx: "auto", mt: 4, p: 2 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Tooltip title={view === "feed" ? "Create Post" : "Back to Feed"}>
        <Fab
          color="secondary"
          onClick={() => {
            resetForm();
            setView(view === "feed" ? "create" : "feed");
          }}
          sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 1000 }}
        >
          {view === "feed" ? <AddIcon /> : <ArrowBackIcon />}
        </Fab>
      </Tooltip>
      {view === "create" ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {editPost ? "Edit Post ✏️" : "Create New Post 📝"}
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What's on your mind?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                border: "2px dashed #aaa",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <input type="file" onChange={handleImageChange} />
              {imagePreview && (
                <>
                  {imagePreview.match(/\.(mp4|webm|ogg)$/i) ? (
                    <CardMedia
                      component="video"
                      src={imagePreview}
                      controls
                      height="200"
                      sx={{ borderRadius: 2, mt: 2 }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      height="200"
                      sx={{ borderRadius: 2, mt: 2 }}
                    />
                  )}
                </>
              )}
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePostSubmit}
              disabled={!title && !desc && !image}
            >
              {editPost ? "Update Post" : "Post"}
            </Button>
          </Card>
        </motion.div>
      ) : (
        posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 3 }}>
              <CardHeader
                avatar={
                  post.user?.avatar ? (
                    <Avatar src={post.user.avatar} />
                  ) : (
                    <Avatar
                      sx={{ bgcolor: getRandomColor(post.user?.name || "") }}
                    >
                      {`${post.user?.name?.[0] ?? ""}`.toUpperCase()}
                    </Avatar>
                  )
                }
                title={
                  <Typography
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      display: "inline-block",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#7e65ff",
                      },
                    }}
                    onClick={() => navigate(`/profile/${post.user?.id}`)}
                  >
                    {post.user?.name} {post.user?.lastname}
                  </Typography>
                }
                subheader={moment(post.created_at).fromNow()}
                action={
                  user?.id === post.user?.id && (
                    <Box display="flex">
                      <IconButton
                        onClick={() => handleEdit(post)}
                        sx={{
                          color: "inherit",
                          "&:hover": {
                            color: "#00bcd4",
                            backgroundColor: "#e0f7fa",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => confirmDelete(post.id)}
                        sx={{
                          color: "inherit",
                          "&:hover": {
                            color: "#f44336",
                            backgroundColor: "#ffebee",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )
                }
              />
              {post.image &&
                (post.image.match(/\.(mp4|webm|ogg)$/i) ? (
                  <CardMedia
                    component="video"
                    src={post.image}
                    controls
                    sx={{ maxHeight: 400, borderRadius: 2 }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    image={post.image}
                    sx={{ maxHeight: 400, borderRadius: 2 }}
                  />
                ))}

              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {post.title}
                </Typography>
                <Typography sx={{ mt: 1 }}>{post.description}</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <IconButton onClick={() => handleLike(post.id)}>
                    <FavoriteIcon color={post.liked ? "error" : "disabled"} />
                  </IconButton>
                  {/* <Typography>{post.likesCount || 0}</Typography> */}
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpenLikesDialog(post.id)}
                  >
                    {post.likesCount || 0}
                  </Typography>

                  <IconButton onClick={() => toggleCommentsVisibility(post.id)}>
                    <ChatIcon />
                  </IconButton>
                  <Typography>{post.commentsCount || 0}</Typography>
                </Box>

                {visibleComments[post.id] && (
                  <Paper
                    variant="outlined"
                    sx={{ mt: 2, p: 2, borderRadius: 2, background: "#f9f9f9" }}
                  >
                    {(commentsByPostId[post.id] || []).map((comment) => (
                      <Box
                        key={comment.id}
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box flex={1}>
                          {editCommentMap[comment.id] !== undefined ? (
                            <>
                              <TextField
                                fullWidth
                                value={editCommentMap[comment.id]}
                                onChange={(e) =>
                                  setEditCommentMap((prev) => ({
                                    ...prev,
                                    [comment.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleUpdateComment(comment.id, post.id);
                                  if (e.key === "Escape")
                                    setEditCommentMap((prev) => {
                                      const { [comment.id]: _, ...rest } = prev;
                                      return rest;
                                    });
                                }}
                                size="small"
                                autoFocus
                                sx={{ mb: 1 }}
                              />
                              <Box display="flex" gap={1}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                    handleUpdateComment(comment.id, post.id)
                                  }
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() =>
                                    setEditCommentMap((prev) => {
                                      const { [comment.id]: _, ...rest } = prev;
                                      return rest;
                                    })
                                  }
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <Box>
                              <Typography fontSize="0.95rem">
                                <Typography
                                  component="span"
                                  fontWeight="bold"
                                  display="inline"
                                >
                                  {comment.user?.name}:
                                </Typography>{" "}
                                <Typography component="span" display="inline">
                                  {comment.text}
                                </Typography>
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontSize="0.75rem"
                                sx={{ ml: 0.5 }}
                              >
                                {moment(
                                  comment.createdAt || comment.created_at
                                ).fromNow()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {comment.userId === user?.id && (
                          <Box ml={1}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setEditCommentMap((prev) => ({
                                  ...prev,
                                  [comment.id]: comment.text,
                                }))
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteComment(comment.id, post.id)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />
                    <TextField
                      fullWidth
                      placeholder="Write a comment..."
                      value={commentTextMap[post.id] || ""}
                      onChange={(e) =>
                        setCommentTextMap((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleComment(post.id)
                      }
                      size="small"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleComment(post.id)}
                      disabled={!commentTextMap[post.id]?.trim()}
                      sx={{ mt: 1 }}
                    >
                      Comment
                    </Button>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLikesDialog} onClose={handleCloseLikesDialog}>
        <DialogTitle>People who liked this post</DialogTitle>
        <DialogContent>
          <List>
            {selectedPostLikes.length > 0 ? (
              selectedPostLikes.map((user) => (
                <ListItemText
                  key={user.id}
                  primary={
                    <Typography
                      component={Link}
                      to={`/profile/${user.id}`}
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 600,
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#3f51b5",
                        },
                      }}
                    >
                      {user.name} {user.lastname || ""}
                    </Typography>
                  }
                  secondary={user.email}
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No likes yet.
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
