import { Stack } from "@mui/material";
import React, { memo } from "react";

export const ManagementBodyLayout = memo(
  ({ children }: { children: React.ReactNode }) => {
    return <Stack sx={{ p: 3 }}>{children}</Stack>;
  }
);
