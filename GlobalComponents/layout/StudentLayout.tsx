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
import Footer from "@/PageComponents/HomePage/Footer";
import Link from "next/link";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack className="flex-1 min-h-dvh">
      <AppBar
        position="sticky"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(255, 255, 255, 0.25)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar className="justify-between" sx={{ px: "0px !important" }}>
            <Stack direction="row" gap={1} alignItems="center">
              <SchoolRoundedIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h6" fontWeight="bold" color="textPrimary">
                Admitly
              </Typography>
            </Stack>
            <Link href="/management/login">
              <Button
                variant="contained"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
              >
                Management Login
              </Button>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Stack sx={{ flex: 1 }}>{children}</Stack>
      <Footer />
    </Stack>
  );
};

export default memo(StudentLayout);
