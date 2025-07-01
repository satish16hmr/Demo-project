import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Paper,
  Tooltip,
  ListItemAvatar,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { notifySuccess } from "../../components/toastify";

import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
} from "../../store/actions/user.action";
import {
  getAllPosts,
  toggleLike,
  commentOnPost,
  getPostComments,
  deleteComment,
  updateComment,
  getLikesForPost,
} from "../../store/actions/post.action";
import { api } from "../../libs/axios";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("followers");

  const [visibleComments, setVisibleComments] = useState({});
  const [commentTextMap, setCommentTextMap] = useState({});
  const [editCommentMap, setEditCommentMap] = useState({});
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { token, user: currentUser } = useSelector((state) => state.auth);
  const { likesByPostId } = useSelector((state) => state.post);

  const { followingIds, followers, following } = useSelector(
    (state) => state.user
  );
  const { posts, commentsByPostId } = useSelector((state) => state.post);

  const isOwnProfile = currentUser?.id === Number(id);
  const isFollowing = followingIds.includes(Number(id));

  useEffect(() => {
    fetchProfileData();
    if (currentUser?.id) {
      dispatch(fetchFollowing(currentUser.id));
      dispatch(fetchFollowers(Number(id)));
    }
    dispatch(getAllPosts(Number(id))).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const allPosts = res.payload.posts || [];
        allPosts.forEach((post) => {
          dispatch(getLikesForPost(post.id));
        });
      }
    });
  }, [id, currentUser?.id]);

  useEffect(() => {
    if (id && currentUser?.id) {
      dispatch(getAllPosts(Number(id)));
    }
  }, [posts.map((p) => `${p.id}-${p.likesCount}`).join(",")]);

  useEffect(() => {
    if (currentUser?.id === Number(id)) {
      fetchProfileData();
    }
  }, [currentUser]);

  useEffect(() => {
    setOpenModal(false);
  }, [id]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    }
    setLoading(false);
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await dispatch(unfollowUser(Number(id)));
    } else {
      await dispatch(followUser(Number(id)));
    }
    dispatch(fetchFollowers(Number(id)));
  };

  const refreshPosts = () => dispatch(getAllPosts(Number(id)));

  const handleLike = (postId) => {
    dispatch(toggleLike(postId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(getPostComments(postId));
        dispatch(getLikesForPost(postId));
        dispatch(getAllPosts(Number(id)));
        // notifySuccess("Like status updated");
      }
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
        refreshPosts();
        setCommentTextMap((prev) => ({ ...prev, [postId]: "" }));
      });
    }
  };

  const handleDeleteComment = (commentId, postId) => {
    dispatch(deleteComment(commentId)).then(() => {
      notifySuccess("Comment deleted");
      dispatch(getPostComments(postId));
      refreshPosts();
    });
  };

  const handleUpdateComment = (commentId, postId) => {
    const newText = editCommentMap[commentId]?.trim();
    if (!newText) return;

    dispatch(updateComment({ commentId, text: newText })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        notifySuccess("Comment updated");
        dispatch(getPostComments(postId));
        refreshPosts();
        setEditCommentMap((prev) => {
          const { [commentId]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  };

  if (loading)
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, px: 3, pb: 6 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 100, height: 100, fontSize: 40, mx: "auto" }}>
            {profile.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h5" fontWeight={700} mt={2}>
            {profile.name} {profile.lastname}
          </Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
        </Box>

        {!isOwnProfile && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              color={isFollowing ? "error" : "primary"}
              onClick={handleFollowToggle}
              sx={{ borderRadius: 4, px: 4 }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        )}

        <Stack direction="row" justifyContent="center" spacing={6} mt={4}>
          {[
            {
              label: "Posts",
              count: posts.length,
            },
            {
              label: "Followers",
              count: followers.length,
              onClick: () => {
                setModalType("followers");
                setOpenModal(true);
              },
            },
            {
              label: "Following",
              count: following.length,
              onClick: () => {
                setModalType("following");
                setOpenModal(true);
              },
            },
          ].map(({ label, count, onClick }) => (
            <Box
              key={label}
              sx={{
                textAlign: "center",
                cursor: onClick ? "pointer" : "default",
              }}
              onClick={onClick}
            >
              <Typography variant="subtitle2">{label}</Typography>
              <Typography variant="h6" fontWeight={600}>
                {count}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Box mt={5}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Posts by {profile.name}
          </Typography>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ mb: 4, borderRadius: 4 }}>
                <CardHeader
                  avatar={<Avatar>{profile.name[0]}</Avatar>}
                  titleTypographyProps={{ fontWeight: "bold" }}
                  title={`${profile.name} ${profile.lastname}`}
                  subheader={moment(post.created_at).fromNow()}
                />
                {post.image &&
                  (post.image.match(/\.(mp4|webm|ogg)$/i) ? (
                    <CardMedia
                      component="video"
                      src={post.image}
                      controls
                      sx={{ maxHeight: 400 }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      image={post.image}
                      sx={{ maxHeight: 400 }}
                    />
                  ))}
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography>{post.description}</Typography>

                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <Tooltip title={post.liked ? "Unlike" : "Like"}>
                      <IconButton onClick={() => handleLike(post.id)}>
                        {post.liked ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Typography
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleOpenLikesDialog(post.id)}
                    >
                      {likesByPostId[post.id]?.length ?? post.likes ?? 0}
                    </Typography>
                    <Tooltip title="Comments">
                      <IconButton
                        onClick={() => toggleCommentsVisibility(post.id)}
                      >
                        <ChatIcon />
                      </IconButton>
                    </Tooltip>
                    <Typography>
                      {commentsByPostId[post.id]
                        ? commentsByPostId[post.id].length
                        : post.comments || 0}
                    </Typography>
                  </Box>

                  {visibleComments[post.id] && (
                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 3,
                        background: "#f9f9f9",
                      }}
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
                                        const { [comment.id]: _, ...rest } =
                                          prev;
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
                                        const { [comment.id]: _, ...rest } =
                                          prev;
                                        return rest;
                                      })
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <Typography>
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
                            )}
                          </Box>
                          {comment.userId === currentUser?.id && (
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
                            [postId]: e.target.value,
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
          ))}
        </Box>
      </Paper>

      {/* Likes Dialog */}
      <Dialog open={openLikesDialog} onClose={handleCloseLikesDialog}>
        <DialogTitle>People who liked this post</DialogTitle>
        <DialogContent>
          <List>
            {selectedPostLikes.length > 0 ? (
              selectedPostLikes.map((user) => (
                <ListItemButton
                  key={user.id}
                  onClick={() => {
                    setOpenModal(false);
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.avatar}>
                      {user.name?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.name} ${user.lastname || ""}`}
                    secondary={user.email}
                  />
                </ListItemButton>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No likes yet.
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Followers/Following Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {modalType === "followers" ? "Followers" : "Following"}
        </DialogTitle>
        <DialogContent>
          <List>
            {(modalType === "followers" ? followers : following).map((item) => {
              const user =
                modalType === "followers" ? item.Follower : item.Following;
              const isUserFollowing = followingIds.includes(user.id);
              const isNotMe = user.id !== currentUser.id;

              return (
                <ListItemButton
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar>{user.name?.[0]?.toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.name} ${user.lastname || ""}`}
                    secondary={user.email}
                  />
                  {isOwnProfile && isNotMe && (
                    <Button
                      size="small"
                      variant={isUserFollowing ? "outlined" : "contained"}
                      color={isUserFollowing ? "error" : "primary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isUserFollowing) dispatch(unfollowUser(user.id));
                        else dispatch(followUser(user.id));
                        dispatch(fetchFollowing(currentUser.id));
                        dispatch(fetchFollowers(Number(id)));
                      }}
                    >
                      {isUserFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
