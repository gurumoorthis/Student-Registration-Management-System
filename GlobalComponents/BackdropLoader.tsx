"use client";

import { useAppContext } from "@/app/context/AppContext";
import { Backdrop, CircularProgress } from "@mui/material";

export default function BackdropLoader() {
  const { loading } = useAppContext();

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
