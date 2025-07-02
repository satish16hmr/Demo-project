import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  List,
  ListItem,
  Avatar,
  Typography,
  useTheme,
  Paper,
  Fade,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../store/actions/user.action";
import { clearSearchResults } from "../../store/reducers/user.reducer";
import Loader from "../../components/loader";

export default function SearchUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [query, setQuery] = useState("");
  const { searchedUsers = [], loading = false } = useSelector(
    (state) => state.user || {}
  );
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      dispatch(searchUsers(value));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (initialLoading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: isSmallScreen ? "100%" : 500,
        mx: "auto",
        mt: isSmallScreen ? 3 : 5,
        px: isSmallScreen ? 1 : 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: isSmallScreen ? 2 : 3,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          placeholder="🔍 Search by name, lastname or email"
          value={query}
          onChange={handleSearch}
          variant="outlined"
          sx={{
            input: {
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: isSmallScreen ? "0.9rem" : "1rem",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#222" : "#f0f0f0",
            },
          }}
        />

        {loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Loader />
          </Box>
        )}

        {!loading && searchedUsers.length > 0 && (
          <List sx={{ mt: 2 }}>
            {searchedUsers.map((user, index) => (
              <Fade in timeout={300 + index * 100} key={user.id}>
                <ListItem
                  onClick={() => handleClick(user.id)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "0.3s",
                    mb: 1,
                    py: isSmallScreen ? 1 : 2,
                    px: isSmallScreen ? 1 : 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#2a2a2a" : "#f0f0f0",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      width: isSmallScreen ? 32 : 40,
                      height: isSmallScreen ? 32 : 40,
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Box>
                    <Typography
                      fontWeight="bold"
                      color="text.primary"
                      fontSize={isSmallScreen ? "0.95rem" : "1rem"}
                    >
                      {user.name} {user.lastname}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={isSmallScreen ? "0.8rem" : "0.9rem"}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </ListItem>
              </Fade>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}


