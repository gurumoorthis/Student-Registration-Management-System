"use client";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { memo } from "react";
import { toTitleCase } from "@/utils/toTileCase";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppContext } from "@/app/context/AppContext";
import { Menu } from "@mui/icons-material";
import { getRoleAvatarColor } from "@/utils/getRoleAvatarColor";

export const AppHeader = ({ title }: { title: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { userDetails } = useSelector((state: RootState) => state.AUTH);
  const { setMobileOpen } = useAppContext();
  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
      }}
    >
      <Toolbar className="justify-between">
        <Stack direction="row" alignItems="center">
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar
            sx={{ bgcolor: getRoleAvatarColor[userDetails?.role ?? "#9E9E9E"] }}
          >
            {userDetails?.name?.split("")[0]}
          </Avatar>
          <Stack>
            <Typography variant="subtitle2">{userDetails.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {toTitleCase(userDetails.role)}
            </Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default memo(AppHeader);
