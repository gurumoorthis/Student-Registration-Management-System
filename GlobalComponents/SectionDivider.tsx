import { Divider, Stack } from "@mui/material";
import React, { memo } from "react";

function SectionDivider() {
  return (
    <Stack alignItems="center">
      <Divider
        sx={{
          borderWidth: "2px",
          borderColor: "primary.main",
          borderRadius: 2,
          maxWidth: "220px",
          width: "100%",
        }}
      />
    </Stack>
  );
}

export default memo(SectionDivider);
