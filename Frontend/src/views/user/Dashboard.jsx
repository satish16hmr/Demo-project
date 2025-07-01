import React, { useState, useEffect } from "react";
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
import Loader from "../../components/loader.jsx";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.user?.notifications || []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isDashboardRoot = location.pathname === "/dashboard";

  const sidebarContent = (
    <Box
      sx={{
        width: 250,
        bgcolor: "#1f2937",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 2,
        height: "100%",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: "bold",
            py: 2,
            background: "linear-gradient(to right, #6366f1, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SocialApp
        </Typography>
        <Divider sx={{ borderColor: "#374151" }} />
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#374151",
                    borderLeft: "4px solid #60a5fa",
                  },
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <ListItemIcon sx={{ color: "#93c5fd", minWidth: 36 }}>
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
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ px: 2 }}>
        <Divider sx={{ borderColor: "#374151", mb: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
            p: 1,
            bgcolor: "#111827",
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography>{user?.name || "User"}</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          color="error"
          fullWidth
          sx={{ mt: 1 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#101418",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#101418" }}>
      <Box
        sx={{
          width: 250,
          display: { xs: "none", md: "block" },
        }}
      >
        {sidebarContent}
      </Box>
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ sx: { bgcolor: "#1f2937", color: "#fff" } }}
      >
        {sidebarContent}
      </Drawer>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px 0",
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "#1f2937", borderBottom: "1px solid #374151" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="#93c5fd">
              Hello, {user?.name || "User"} 👋
            </Typography>
            <div className="text-md px-5 pointer-coarse: mr-2 text rounded-md">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: 4, bgcolor: "#111827", color: "#e5e7eb" }}>
          {isDashboardRoot ? (
            <Box
              sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 10,
                p: 5,
                bgcolor: "#1f2937",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: 4,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 2,
                  fontSize: 32,
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome back, {user?.name || "User"} 👋
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Stay connected, stay inspired. Let's explore what your world is
                sharing today!
              </Typography>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3448/3448440.png"
                alt="Welcome"
                width="200"
                className="mx-auto"
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
