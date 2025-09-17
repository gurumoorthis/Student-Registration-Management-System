import { AppHeader } from "@/GlobalComponents/layout/AppHeader";
import { ManagementBodyLayout } from "@/GlobalComponents/layout/ManagementBodyLayout";
import Students from "@/PageComponents/Students";
import { Stack } from "@mui/material";

export default function Home() {
  return (
    <Stack>
      <AppHeader title="Students" />
      <ManagementBodyLayout>
        <Students />
      </ManagementBodyLayout>
    </Stack>
  );
}
