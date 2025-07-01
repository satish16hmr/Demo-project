import React from "react";
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
    IconButton,
    Badge
} from "@mui/material";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/auth.action.jsx";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MessageIcon from "@mui/icons-material/Message";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";

const GradientText = styled(Typography)({
    background: "linear-gradient(45deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block"
});

const FloatingAvatar = styled(motion.div)({
    position: "relative",
    "&:after": {
        content: '""',
        position: "absolute",
        inset: "-8px",
        background: "linear-gradient(45deg, #6366F1, #EC4899)",
        borderRadius: "50%",
        zIndex: -1,
        opacity: 0,
        transition: "opacity 0.3s ease"
    },
    "&:hover:after": {
        opacity: 0.6
    }
});

const sidebarItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Posts Feed", path: "/dashboard/posts", icon: <ArticleIcon /> },
    {
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: (
            <Badge badgeContent={4} color="error">
                <NotificationsIcon />
            </Badge>
        )
    },
    { label: "Discover", path: "/dashboard/follow", icon: <GroupAddIcon /> },
    { label: "Search", path: "/dashboard/search", icon: <SearchIcon /> },
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
];

const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: (i) => ({
        x: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            type: "spring",
            stiffness: 100
        }
    })
};

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const isDashboardRoot = location.pathname === "/dashboard";

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "#0F172A",
            color: "#E2E8F0"
        }}>
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{
                    width: 280,
                    background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px 0",
                    position: "relative",
                    zIndex: 10,
                    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)"
                }}
            >
                <Box>
                    <Box sx={{ px: 3, mb: 4 }}>
                        <GradientText
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                ✨
                            </motion.div>
                            SocialApp
                        </GradientText>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

                    <List>
                        {sidebarItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={sidebarVariants}
                            >
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            px: 3,
                                            py: 1.5,
                                            mx: 2,
                                            borderRadius: "12px",
                                            "&.Mui-selected": {
                                                background: "rgba(99, 102, 241, 0.2)",
                                                borderLeft: "4px solid #6366F1"
                                            },
                                            "&:hover": {
                                                background: "rgba(255, 255, 255, 0.05)",
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            color: location.pathname === item.path ? "#6366F1" : "#94A3B8",
                                            minWidth: 36
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: location.pathname === item.path ? 600 : 400,
                                                color: location.pathname === item.path ? "#E2E8F0" : "#94A3B8"
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </motion.div>
                        ))}
                    </List>
                </Box>

                <Box sx={{ px: 3 }}>
                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                            p: 2,
                            background: "rgba(15, 23, 42, 0.5)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        <FloatingAvatar whileHover={{ scale: 1.05 }}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: "#6366F1",
                                    fontWeight: 600
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                        </FloatingAvatar>
                        <Box>
                            <Typography fontWeight={600}>{user?.name || "User"}</Typography>
                            <Typography variant="body2" color="#94A3B8">
                                {user?.email || "user@example.com"}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        color="error"
                        fullWidth
                        sx={{
                            borderRadius: "12px",
                            py: 1,
                            fontWeight: 600,
                            borderWidth: "2px",
                            "&:hover": {
                                borderWidth: "2px"
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </motion.div>

            <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                background: "radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 0.8) 0%, #0F172A 100%)"
            }}>
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        background: "rgba(15, 23, 42, 0.7)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)"
                    }}
                >
                    <Toolbar sx={{
                        justifyContent: "space-between",
                        py: 1
                    }}>
                        <Typography variant="h6" fontWeight={600}>
                            <motion.div
                                animate={{
                                    x: [0, 5, -5, 0],
                                    textShadow: [
                                        "0 0 0px #6366F1",
                                        "0 0 5px #6366F1",
                                        "0 0 10px #6366F1",
                                        "0 0 0px #6366F1"
                                    ]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3
                                }}
                            >
                                Hello, <span style={{ color: "#6366F1" }}>{user?.name || "User"}</span> 👋
                            </motion.div>
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <IconButton sx={{
                                background: "rgba(99, 102, 241, 0.2)",
                                "&:hover": {
                                    background: "rgba(99, 102, 241, 0.3)"
                                }
                            }}>
                                <Badge badgeContent={3} color="error">
                                    <NotificationsIcon sx={{ color: "#E2E8F0" }} />
                                </Badge>
                            </IconButton>
                            <IconButton sx={{
                                background: "rgba(99, 102, 241, 0.2)",
                                "&:hover": {
                                    background: "rgba(99, 102, 241, 0.3)"
                                }
                            }}>
                                <MessageIcon sx={{ color: "#E2E8F0" }} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{
                    flex: 1,
                    p: 4,
                    overflow: "auto",
                    position: "relative"
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            style={{ height: "100%" }}
                        >
                            {isDashboardRoot ? (
                                <Box
                                    sx={{
                                        maxWidth: 800,
                                        mx: "auto",
                                        mt: 4,
                                        p: 6,
                                        background: "rgba(30, 41, 59, 0.5)",
                                        borderRadius: "24px",
                                        textAlign: "center",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                                        backdropFilter: "blur(10px)",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&:before": {
                                            content: '""',
                                            position: "absolute",
                                            top: "-50%",
                                            left: "-50%",
                                            width: "200%",
                                            height: "200%",
                                            background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
                                            animation: "rotate 20s linear infinite",
                                            "@keyframes rotate": {
                                                "0%": { transform: "rotate(0deg)" },
                                                "100%": { transform: "rotate(360deg)" }
                                            }
                                        }
                                    }}
                                >
                                    <Box position="relative" zIndex={1}>
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 5
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#6366F1",
                                                    width: 100,
                                                    height: 100,
                                                    mx: "auto",
                                                    mb: 3,
                                                    fontSize: 40,
                                                    fontWeight: 600,
                                                    boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.3)"
                                                }}
                                            >
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </Avatar>
                                        </motion.div>

                                        <GradientText variant="h3" fontWeight={800} gutterBottom>
                                            Welcome back, {user?.name || "User"}!
                                        </GradientText>

                                        <Typography variant="h6" sx={{ mb: 3, color: "#94A3B8" }}>
                                            Stay connected with your community. Discover what's new today.
                                        </Typography>

                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                sx={{
                                                    mt: 2,
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: "12px",
                                                    fontWeight: 600,
                                                    textTransform: "none",
                                                    fontSize: "1rem",
                                                    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)"
                                                }}
                                                onClick={() => navigate("/dashboard/posts")}
                                            >
                                                Explore Feed
                                            </Button>
                                        </motion.div>

                                        <motion.img
                                            src="https://cdn-icons-png.flaticon.com/512/3448/3448440.png"
                                            alt="Welcome"
                                            width="250"
                                            style={{ margin: "30px auto 0" }}
                                            animate={{
                                                y: [0, -10, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ) : (
                                <Outlet />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Box>
        </Box>
    );
}