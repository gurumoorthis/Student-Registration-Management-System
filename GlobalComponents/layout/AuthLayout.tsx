import { Box, Container, Paper } from "@mui/material";
import React from "react";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box className="flex h-screen items-center">
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{ p: 4, borderRadius: 3 }}
          className="text-center"
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
