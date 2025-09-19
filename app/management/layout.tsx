"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import Sidebar from "@/GlobalComponents/layout/Sidebar";
import type { Role } from "@/utils/types";
import { Stack } from "@mui/material";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  const sidebarPages = [
    "/management/dashboard",
    "/management/students",
    "/management/teachers",
    "/management/settings",
  ];

  const showSidebar = sidebarPages.some((page) => pathname.startsWith(page));

  useEffect(() => {
    const storedRole = secureLocalStorage.getItem("userRole") as Role | null;
    setRole(storedRole);
  }, [pathname]);

  if (true) {
    return (
      <Stack direction={{ xs: "column", sm: "row" }}>
        <Sidebar role={"teacher"} />
        <main className=" flex-1 overflow-y-auto h-screen flex flex-col">
          {children}
        </main>
      </Stack>
    );
  }

  // Default layout without sidebar
  return <>{children}</>;
}
