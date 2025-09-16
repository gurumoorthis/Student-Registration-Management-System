"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import Sidebar from "@/GlobalComponents/Sidebar";
import ReduxProvider from "@/ReduxProvider";
import type { Role } from "@/utils/types";
import { AppProvider } from "@/app/context/AppContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  const sidebarPages = ["/", "/policies", "/policyholders", "/settings"];
  const showSidebar = sidebarPages.some((page) => pathname.startsWith(page));

  useEffect(() => {
    if (pathname) {
      const storedRole = secureLocalStorage.getItem("userRole") as Role | null;
      setRole(storedRole);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <Toaster />
        <ReduxProvider>
          <AppProvider>
            <ThemeProvider theme={theme}>
              {showSidebar && role ? (
                <div className="flex flex-col sm:flex-row">
                  <Sidebar role={role} />
                  <main className="sm:ml-64 flex-1 px-8 pb-8 pt-2 sm:pt-8 overflow-y-auto h-screen">
                    {children}
                  </main>
                </div>
              ) : (
                <>{children}</>
              )}
            </ThemeProvider>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
