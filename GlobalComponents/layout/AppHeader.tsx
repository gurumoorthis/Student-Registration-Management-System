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
import PageTitle from "../PageTitle";
import { toTitleCase } from "@/utils/toTileCase";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const AppHeader = memo(({ title }: { title: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { userDetails } = useSelector((state: RootState) => state.AUTH);
  return (
    <>
      {!isMobile ? (
        <AppBar
          position="sticky"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: { xs: "none", sm: "block" },
            boxShadow: "none",
          }}
        >
          <Toolbar className="justify-between">
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
            <Stack direction="row" gap={1}>
              <Avatar />
              <Box>
                <Typography variant="subtitle1">{userDetails.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {toTitleCase(userDetails.roles?.name)}
                </Typography>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>
      ) : (
        <PageTitle title={title} />
      )}
    </>
  );
});
