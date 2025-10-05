"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/GlobalComponents/layout/Sidebar";
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userDetails } = useSelector((state: RootState) => state.AUTH);

  const sidebarPages = [
    "/management/dashboard",
    "/management/students",
    "/management/users",
  ];

  const showSidebar = sidebarPages.some((page) => pathname.startsWith(page));

  if (showSidebar) {
    return (
      <Stack direction={{ xs: "column", sm: "row" }}>
        {showSidebar && <Sidebar role={userDetails.role} />}
        <main className=" flex-1 overflow-y-auto h-screen flex flex-col">
          {children}
        </main>
      </Stack>
    );
  }

  // Default layout without sidebar
  return <>{children}</>;
}
