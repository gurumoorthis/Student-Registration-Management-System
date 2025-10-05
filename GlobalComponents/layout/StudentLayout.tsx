import {
  AppBar,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useRouter } from "next/navigation";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <Stack className="flex-1 min-h-dvh">
      <AppBar
        position="sticky"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "none",
          background: "linear-gradient(135deg, #14B8A6 0%, #22C55E 100%)",
        }}
      >
        <Toolbar className="justify-between">
          <Stack direction="row" gap={1} alignItems="center">
            <SchoolRoundedIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h6" fontWeight="bold" color="textPrimary">
              Admitly
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => router.push("/management/login")}
          >
            Management Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
    </Stack>
  );
};

export default memo(StudentLayout);
