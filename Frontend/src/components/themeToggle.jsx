import React, { useContext } from "react";
import { IconButton, useTheme, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../theme/ThemeContext";

const ThemeToggle = () => {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title="Toggle theme">
      <IconButton onClick={toggleTheme} color="inherit">
        {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;