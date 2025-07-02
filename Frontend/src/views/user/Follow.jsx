import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useFollow } from "../../hooks/useFollow.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FollowUsers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state) => state.auth);
  const { users, followingIds, loading, getAllUsers, follow, unfollow } =
    useFollow();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: theme.palette.mode === "dark" ? "#3b82f6" : "#6366f1",
            }}
          />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        mx: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
            mb: 4,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                : "linear-gradient(45deg, #6366f1, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "4px",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                  : "linear-gradient(90deg, #6366f1, #ec4899)",
              borderRadius: 2,
            },
          }}
        >
          Discover Amazing People
        </Typography>
      </motion.div>

      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        justifyContent={users.length <= 2 ? "center" : "center"}
      >
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40vh",
                textAlign: "center",
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 500 }}
              >
                No users found
              </Typography>
              <Button
                variant="outlined"
                onClick={getAllUsers}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderColor:
                    theme.palette.mode === "dark" ? "#3b82f6" : "#6366f1",
                  color: theme.palette.mode === "dark" ? "#3b82f6" : "#6366f1",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(59, 130, 246, 0.08)"
                        : "rgba(99, 102, 241, 0.08)",
                  },
                }}
              >
                Try Again
              </Button>
            </Box>
          </motion.div>
        ) : (
          users.map((u, index) => {
            const isFollowing = followingIds.includes(u.id);
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={u.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  style={{ width: "100%" }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      width: "100%",
                      maxWidth: 320,
                      minHeight: 280, // Added fixed height
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(145deg, #1e1e2e, #232333)"
                          : "linear-gradient(145deg, #ffffff, #f8f9fa)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 8px 32px rgba(0,0,0,0.3)"
                          : "0 8px 24px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.05)",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Decorative accent */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                            : "linear-gradient(90deg, #6366f1, #ec4899)",
                      }}
                    />

                    <Avatar
                      src={u.avatar}
                      alt={u.name}
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        fontSize: 32,
                        border: "3px solid",
                        borderColor:
                          theme.palette.mode === "dark" ? "#3b82f6" : "#6366f1",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 4px 20px rgba(59, 130, 246, 0.3)"
                            : "0 4px 20px rgba(99, 102, 241, 0.2)",
                      }}
                    >
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>

                    <Typography
                      component={Link}
                      to={`/profile/${u.id}`}
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        textDecoration: "none",
                        fontSize: "1.1rem",
                        mb: 0.5,
                        "&:hover": {
                          color:
                            theme.palette.mode === "dark"
                              ? "#3b82f6"
                              : "#6366f1",
                        },
                      }}
                    >
                      {u.name} {u.lastname}
                    </Typography>

                    <Chip
                      label={`@${u.email?.split("@")[0]}`}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(99, 102, 241, 0.1)",
                        color:
                          theme.palette.mode === "dark" ? "#3b82f6" : "#6366f1",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: "24px",
                      }}
                    />

                    <Box sx={{ mt: "auto", width: "100%", minHeight: 42 }}>
                      <Button
                        variant={isFollowing ? "outlined" : "contained"}
                        onClick={() =>
                          isFollowing ? unfollow(u.id) : follow(u.id)
                        }
                        size="medium"
                        fullWidth
                        sx={{
                          minWidth: 120,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: "none",
                          px: 3,
                          py: 1.2,
                          background: isFollowing
                            ? "transparent"
                            : theme.palette.mode === "dark"
                            ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                            : "linear-gradient(to right, #6366f1, #ec4899)",
                          color: isFollowing
                            ? theme.palette.mode === "dark"
                              ? "#3b82f6"
                              : "#6366f1"
                            : "white",
                          boxShadow: "none",
                          border: isFollowing
                            ? theme.palette.mode === "dark"
                              ? "1px solid #3b82f6"
                              : "1px solid #6366f1"
                            : "none",
                          "&:hover": {
                            background: isFollowing
                              ? theme.palette.mode === "dark"
                                ? "rgba(59, 130, 246, 0.1)"
                                : "rgba(99, 102, 241, 0.1)"
                              : theme.palette.mode === "dark"
                              ? "linear-gradient(to right, #2563eb, #7c3aed)"
                              : "linear-gradient(to right, #4f46e5, #db2777)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 4px 20px rgba(59, 130, 246, 0.3)"
                                : "0 4px 20px rgba(99, 102, 241, 0.2)",
                          },
                        }}
                      >
                        {isFollowing ? (
                          <>
                            Following
                            <Box
                              component="span"
                              sx={{
                                ml: 1,
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor:
                                  theme.palette.mode === "dark"
                                    ? "#3b82f6"
                                    : "#6366f1",
                              }}
                            />
                          </>
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
