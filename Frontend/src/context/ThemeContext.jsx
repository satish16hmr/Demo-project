import React, { createContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const storedMode = localStorage.getItem("themeMode") || "light";
  const [mode, setMode] = useState(storedMode);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === "light" ? "#3b82f6" : "#60a5fa",
        },
        background: {
          default: mode === "light" ? "#f5f5f5" : "#121212",
          paper: mode === "light" ? "#ffffff" : "#1e1e1e",
        },
      },
    }), [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
