"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CallToActionSection() {
  const router = useRouter();

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 8,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="body1" mb={4}>
          Join thousands of students who have already chosen EduPortal for their
          academic success.
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Button
            variant="contained"
            sx={{ bgcolor: "white", color: "primary.main", fontWeight: "bold" }}
            onClick={() => router.push("/student/register")}
          >
            Apply Now
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
