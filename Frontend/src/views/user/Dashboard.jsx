import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  ListItemIcon,
  Button,
  useTheme,
  Badge,
  IconButton,
  Drawer,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/auth.action.jsx";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Loader from "../../components/loader.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const sidebarItems = [
  { label: "Posts/Feed", path: "/dashboard/posts", icon: <ArticleIcon /> },
  {
    label: "Notifications",
    path: "/dashboard/notifications",
    icon: <NotificationsIcon />,
  },
  { label: "Follow Users", path: "/dashboard/follow", icon: <GroupAddIcon /> },
  { label: "Search Users", path: "/dashboard/search", icon: <SearchIcon /> },
  { label: "Profile", path: "/profile", icon: <PersonIcon /> },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.user?.notifications || []);
  const isDashboardRoot = location.pathname === "/dashboard";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 250,
        bgcolor: "background.paper",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        py: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Avatar
            src="/logo.png"
            sx={{
              width: 40,
              height: 40,
              mr: 1,
              bgcolor: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #6366f1, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SocialApp
          </Typography>
        </Box>
        <Divider />
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  px: 3,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                    borderLeft: "4px solid",
                    borderColor: "primary.main",
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderLeft: "4px solid",
                    borderColor: "primary.light",
                  },
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <ListItemIcon sx={{ color: "primary.main", minWidth: 36 }}>
                  {item.label === "Notifications" ? (
                    <Badge
                      badgeContent={notifications.length}
                      color="error"
                      invisible={notifications.length === 0}
                    >
                      <NotificationsIcon />
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
            p: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              fontSize: "1.1rem",
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user?.email?.split("@")[0]}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="body2">
            {mode === "dark" ? "Dark Mode" : "Light Mode"}
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit" size="small">
            {mode === "dark" ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          color="error"
          fullWidth
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            py: 1,
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ width: 250, display: { xs: "none", md: "block" } }}>
        {sidebarContent}
      </Box>

      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            width: 250,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              px: { xs: 2, sm: 3 },
              padding: "26px 25px",
              display: "flex",
              alignItems: "center",
              borderbBottom: "1px solid",
              borderColor: "divider",
              borderLeft: "0.4px solid blue",
              "@media (min-width: 600px)": {
                padding: "26px 25px", 
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                edge="start"
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  color: "text.primary",
                  mr: 1,
                }}
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  display: { xs: "none", sm: "block" },
                  background:
                    mode === "dark"
                      ? "linear-gradient(to right, #60a5fa, #8b5cf6)"
                      : "linear-gradient(to right, #6366f1, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hello, {user?.name || "User"} 👋
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                size="small"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  color: "text.primary",
                  bgcolor: "action.hover",
                  p: 1,
                }}
              >
                {mode === "dark" ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </IconButton>

              <Avatar
                src={user?.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "1rem",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {isDashboardRoot ? (
            <Box
              sx={{
                maxWidth: 600,
                mx: "auto",
                mt: { xs: 4, sm: 6, md: 8 },
                p: { xs: 3, sm: 4, md: 5 },
                bgcolor: "background.paper",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Avatar
                src={user?.avatar}
                sx={{
                  bgcolor: "primary.main",
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  fontSize: "1.8rem",
                  border: "2px solid",
                  borderColor: "primary.light",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome back, {user?.name || "User"} 👋
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Stay connected, stay inspired. Let's explore what your world is
                sharing today!
              </Typography>
              <Box
                component="img"
                src="https://cdn-icons-png.flaticon.com/512/3448/3448440.png"
                alt="Welcome"
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  height: "auto",
                  margin: "0 auto",
                  filter:
                    theme.palette.mode === "dark" ? "invert(0.1)" : "none",
                }}
              />
            </Box>
          ) : (
            <Outlet />
          )}
        </Box>
      </Box>
    </Box>
  );
}
