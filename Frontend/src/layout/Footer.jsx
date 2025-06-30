import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e",
        color: "#fff",
        py: 3,
        mt: 5,
        textAlign: "center",
        borderTop: "1px solid #333",
        position: "relative",
        bottom: 0,
        top: "auto",
        width: "100%",
        backdropFilter: "blur(10px)",
        boxShadow: "0 -2px 10px rgba(0, 0,0, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        SocialSphere
      </Typography>

      <Typography variant="body2" color="gray">
        © {new Date().getFullYear()} SocialSphere. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
