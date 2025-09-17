import { AppHeader } from "@/GlobalComponents/layout/AppHeader";
import { ManagementBodyLayout } from "@/GlobalComponents/layout/ManagementBodyLayout";
import Dashboard from "@/PageComponents/Dashboard";
import { Stack } from "@mui/material";

export default function Home() {
  return (
    <Stack>
      <AppHeader title="Dashboard" />
      <ManagementBodyLayout>
        <Dashboard />
      </ManagementBodyLayout>
    </Stack>
  );
}
