"use client";

import React, { memo } from "react";
import { Stack, Typography, Divider } from "@mui/material";

interface FormTitleProps {
  title: string;
}

const FormTitle = ({ title }: FormTitleProps) => {
  return (
    <Stack alignItems="flex-start" sx={{ width: "fit-content" }}>
      <Typography variant="h6">{title}</Typography>
      <Divider
        sx={{ width: "100%", borderColor: "primary.main", borderWidth: "1px" }}
      />
    </Stack>
  );
};

export default memo(FormTitle);
