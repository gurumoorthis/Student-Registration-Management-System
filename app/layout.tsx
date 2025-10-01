"use client";
import "./globals.css";
import ReduxProvider from "@/ReduxProvider";
import { AppProvider } from "@/app/context/AppContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <ThemeProvider theme={theme}>
          <ReduxProvider>
            <AppProvider>{children}</AppProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
