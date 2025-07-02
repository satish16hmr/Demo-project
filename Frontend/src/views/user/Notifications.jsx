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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  fetchFollowing,
  followUser,
} from "../../store/actions/user.action";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { notifications, loading, followingIds } = useSelector(
    (state) => state.user
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());
    if (currentUser?.id) {
      dispatch(fetchFollowing(currentUser.id));
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
    <Box
      sx={{
        px: isMobile ? 2 : 3,
        py: 4,
        maxWidth: "100%",
        width: isMobile ? "100%" : "700px",
        mx: "auto",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={700}
        gutterBottom
        textAlign={isMobile ? "center" : "left"}
      >
        🔔 Your Notifications
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ mt: 4 }}
          textAlign={isMobile ? "center" : "left"}
        >
          You're all caught up! 🎉
        </Typography>
      ) : (
        <List sx={{ width: "100%" }}>
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
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "#f9f9f9",
                    border:
                      theme.palette.mode === "dark"
                        ? "1px solid #374151"
                        : "1px solid #ddd",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#60a5fa" }}>
                      {fromUser?.name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" color="text.primary">
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#3b82f6",
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
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatTime(notif.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: isMobile ? 1 : 0,
                    }}
                  >
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
                      <DeleteIcon
                        sx={{ color: "#f87171", fontSize: isMobile ? 20 : 24 }}
                      />
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
