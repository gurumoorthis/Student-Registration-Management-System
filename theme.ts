"use client";

import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0297f5",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

export default theme;
