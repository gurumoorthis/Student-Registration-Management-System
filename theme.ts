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
    text: {
      primary: "#0a2540",
    },
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
          letterSpacing: "0.4px",
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
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "16px 20px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "20px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "20px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
