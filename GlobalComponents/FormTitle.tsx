"use client";

import { memo } from "react";
import { Stack, Typography, Divider } from "@mui/material";

interface FormTitleProps {
  title: string;
}

const FormTitle = memo(({ title }: FormTitleProps) => {
  console.log(title);
  return (
    <Stack alignItems="flex-start" sx={{ width: "fit-content" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider
        sx={{ width: "100%", borderColor: "primary.main", borderWidth: "1px" }}
      />
    </Stack>
  );
});

export { FormTitle };
