import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: 5,
          boxShadow: 4,
          borderRadius: 4,
          bgcolor: "#f3f4f6",
          textAlign: "center",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3448/3448440.png"
          alt="SocialApp"
          width={120}
          style={{ marginBottom: 24 }}
        />
        <Typography variant="h3" fontWeight={700} gutterBottom color="primary">
          Welcome to SocialApp
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Connect, share, and explore with friends. Post updates, follow users,
          and stay inspired by your community.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="primary"
            size="large"
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
