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
        <ReduxProvider>
          <AppProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
