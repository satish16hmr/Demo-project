import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useFollow } from "../../hooks/useFollow.jsx";
import { Link } from "react-router-dom";

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
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight={700}
        gutterBottom
        sx={{ textAlign: isMobile ? "center" : "left" }}
      >
        Discover Users
      </Typography>

      <Stack spacing={2}>
        {users.length === 0 && (
          <Typography color="text.secondary">No users found.</Typography>
        )}
        {users.map((u) => (
          <Box
            key={u.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              bgcolor: "#fff",
              color: "#1f2937",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {u.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography
                  fontWeight={600}
                  component={Link}
                  to={`/profile/${u.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: "0.95rem",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {u.name} {u.lastname}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", fontSize: "0.8rem" }}
                >
                  {u.email}
                </Typography>
              </Box>
            </Box>

            <Button
              variant={followingIds.includes(u.id) ? "outlined" : "contained"}
              color={followingIds.includes(u.id) ? "error" : "primary"}
              onClick={() =>
                followingIds.includes(u.id)
                  ? unfollow(u.id)
                  : follow(u.id)
              }
              size="small"
              sx={{
                mt: { xs: 1, sm: 0 },
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              {followingIds.includes(u.id) ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
