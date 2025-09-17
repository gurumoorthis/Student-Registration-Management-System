"use client";

import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    // primary: {
    //   main: "#0297f5",
    // },
    // secondary: {
    //   main: "#9c27b0",
    // },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  components: {
    // MuiDivider: {
    //   styleOverrides: {
    //     root: {
    //       borderColor: "#0000006b",
    //     },
    //   },
    // },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          letterSpacing: "0.1px",
          boxShadow: "none",
        },
      },
      variants: [
        {
          props: { size: "large" },
          style: {
            fontSize: "1rem",
          },
        },
      ],
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
