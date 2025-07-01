import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  Fade,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
} from "../../store/actions/user.action";
import { fetchFollowing, followUser } from "../../store/actions/user.action";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, loading } = useSelector((state) => state.user);
  const { followingIds } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());
    if (currentUser?.id) {
      dispatch(fetchFollowing(currentUser.id)); // Sync follow state on load
    }
  }, [dispatch, currentUser?.id]);

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleFollowBack = async (userId) => {
    await dispatch(followUser(userId)).unwrap();
    dispatch(fetchFollowing(currentUser.id));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🔔 Your Notifications
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4 }}>
          You're all caught up! 🎉
        </Typography>
      ) : (
        <List>
          {notifications.map((notif) => {
            const fromUser = notif.fromUser;
            const userId = fromUser?.id;
            const isFollowing = followingIds.includes(userId);

            return (
              <Fade in={true} timeout={400} key={notif.id}>
                <Box
                  sx={{
                    mb: 2,
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #374151",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#60a5fa" }}>
                      {fromUser?.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" color="white">
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#60a5fa",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            fromUser && navigate(`/profile/${fromUser.id}`)
                          }
                          onMouseOver={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {fromUser
                            ? `${fromUser.name} ${fromUser.lastname}`
                            : "Someone"}
                        </span>{" "}
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        {formatTime(notif.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {notif.type === "follow" &&
                      userId !== currentUser?.id &&
                      (isFollowing ? (
                        <Chip
                          label="Following"
                          size="small"
                          sx={{
                            bgcolor: "#10b981",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Follow Back"
                          clickable
                          onClick={() => handleFollowBack(userId)}
                          size="small"
                          sx={{
                            bgcolor: "#3b82f6",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      ))}

                    <IconButton onClick={() => handleDelete(notif.id)}>
                      <DeleteIcon sx={{ color: "#f87171" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Fade>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Notifications;
