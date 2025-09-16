"use client";

import { Typography } from "@mui/material";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <Typography
      variant="h5"
      component="h2"
      fontWeight="bold"
      color="text.primary"
      gutterBottom
    >
      {title}
    </Typography>
  );
}
