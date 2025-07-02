import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Stack,
  Divider,
  IconButton,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  CardMedia,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../../../store/actions/auth.action";
import {
  updateProfile,
  deleteProfile,
} from "../../../store/actions/user.action";
import { getAllPosts } from "../../../store/actions/post.action";
import {
  fetchFollowers,
  fetchFollowing,
} from "../../../store/actions/user.action";
import { motion } from "framer-motion";

export default function Profile() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const { followers, following } = useSelector((state) => state.user);

  const [form, setForm] = useState({ name: "", lastname: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
      });
      dispatch(getAllPosts(user.id));
      dispatch(fetchFollowers(user.id));
      dispatch(fetchFollowing(user.id));
    }
  }, [user, dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (!res.error) {
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    }
  };

  const handleDeleteProfile = async () => {
    await dispatch(deleteProfile());
    dispatch(logout());
    navigate("/signup");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 6,
          p: 4,
          borderRadius: "16px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(31, 38, 135, 0.15)",
          bgcolor: theme.palette.background.paper,
          backdropFilter: "blur(8px)",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.18)",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #181A20 0%, #23272F 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.9) 100%)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 36,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "3px solid white",
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </motion.div>
          <Stack direction="row" spacing={1}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => setEditMode(true)}
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.2)" },
                }}
              >
                <EditIcon color="primary" />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <DeleteIcon />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={handleLogout}
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.1)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.2)" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </motion.div>
          </Stack>
        </Stack>

        <Typography
          variant="h5"
          fontWeight={700}
          mt={2}
          sx={{
            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          {user?.name} {user?.lastname}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
            "&:before": {
              content: '""',
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              bgcolor: "success.main",
              mr: 1,
            },
          }}
        >
          {user?.email}
        </Typography>

        <Stack
          direction="row"
          spacing={4}
          mt={3}
          justifyContent="center"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "rgba(0,0,0,0.1)",
                borderRightWidth: "2px",
                borderStyle: "dashed",
              }}
            />
          }
        >
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700}>
              {posts.length}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
          </Box>
          <Box
            textAlign="center"
            onClick={() => setOpenFollowersModal(true)}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6" fontWeight={700}>
              {followers.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Followers
            </Typography>
          </Box>

          <Box
            textAlign="center"
            onClick={() => setOpenFollowingModal(true)}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="h6" fontWeight={700}>
              {following.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Following
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={{
            my: 3,
            borderColor:
              theme.palette.mode === "dark" ? "#23272F" : "rgba(0,0,0,0.1)",
            borderBottomWidth: "2px",
            borderStyle: "dashed",
          }}
        />
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                bgcolor: "rgba(46, 125, 50, 0.1)",
              }}
            >
              {success}
            </Alert>
          </motion.div>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              bgcolor: "rgba(211, 47, 47, 0.1)",
            }}
          >
            {error}
          </Alert>
        )}

        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component="form"
              onSubmit={handleUpdate}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "12px",
                bgcolor: "rgba(0,0,0,0.02)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <TextField
                label="First Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />

              <Stack
                direction="row"
                spacing={2}
                mt={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  Save
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
        {posts.length > 0 && (
          <Box mt={5}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                position: "relative",
                display: "inline-block",
                color: theme.palette.text.primary,
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  width: "50%",
                  height: "3px",
                  bgcolor: "primary.main",
                  borderRadius: "3px",
                },
              }}
            >
              My Posts
            </Typography>
            <Stack spacing={2} mt={2}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: "12px",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 3px 10px rgba(0,0,0,0.25)"
                          : "0 3px 10px rgba(0,0,0,0.05)",
                      border:
                        theme.palette.mode === "dark"
                          ? "1px solid #23272F"
                          : "1px solid rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 5px 15px rgba(0,0,0,0.4)"
                            : "0 5px 15px rgba(0,0,0,0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Typography fontWeight={600}>{post.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {post.description}
                    </Typography>
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
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Profile</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete your profile? This
            action cannot be undone.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button
              variant="outlined"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteProfile}
            >
              Delete
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openFollowersModal}
        onClose={() => setOpenFollowersModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Followers</DialogTitle>
        <Dialog
          open={openFollowersModal}
          onClose={() => setOpenFollowersModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 0,
              overflow: "hidden",
              bgcolor: theme.palette.background.paper,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 10px 30px rgba(0,0,0,0.5)"
                  : "0 10px 30px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              textAlign: "center",
              px: 3,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to right, #1976d2, #42a5f5)"
                  : "linear-gradient(to right, #1976d2, #42a5f5)",
              color: "#fff",
            }}
          >
            Followers
          </DialogTitle>
          <DialogContent
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              px: 3,
              py: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            {followers.length > 0 ? (
              followers.map((f) => {
                const follower = f.Follower || f;
                return (
                  <Box
                    key={follower.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                    p={1.5}
                    mb={1}
                    borderRadius={2}
                    onClick={() => navigate(`/profile/${follower.id}`)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#23272F" : "#f5f5f5",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#1e293b" : "#e3f2fd",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        {follower.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize="1rem">
                          {follower.name} {follower.lastname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{follower.username || follower.email?.split("@")[0]}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography textAlign="center" color="text.secondary">
                No followers found.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Dialog>

      <Dialog
        open={openFollowingModal}
        onClose={() => setOpenFollowingModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 30px rgba(0,0,0,0.5)"
                : "0 10px 30px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(to right, #388e3c, #66bb6a)"
                : "linear-gradient(to right, #388e3c, #66bb6a)",
            color: "#fff",
          }}
        >
          Following
        </DialogTitle>
        <DialogContent
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            px: 3,
            py: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          {following.length > 0 ? (
            following.map((f) => {
              const followedUser = f.Following || f;
              return (
                <Box
                  key={followedUser.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  p={1.5}
                  mb={1}
                  borderRadius={2}
                  onClick={() => navigate(`/profile/${followedUser.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#23272F" : "#f5f5f5",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#1e293b" : "#e8f5e9",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#388e3c" }}>
                      {followedUser.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600} fontSize="1rem">
                        {followedUser.name} {followedUser.lastname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @
                        {followedUser.username ||
                          followedUser.email?.split("@")[0]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography textAlign="center" color="text.secondary">
              You’re not following anyone yet.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
