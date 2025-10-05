import { Stack } from "@mui/material";
import React, { memo } from "react";

const ManagementBodyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack sx={{ p: 3 }} className="flex-1">
      {children}
    </Stack>
  );
};

export default memo(ManagementBodyLayout);
