"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function LeadForm() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We'll contact you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: 6,
        width: "100%",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary"
      >
        Get in Touch
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mb={3}
      >
        Fill out the form and our admission team will reach out to you.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <TextField
            label="Message"
            name="message"
            fullWidth
            multiline
            rows={isSmall ? 2 : 3}
            value={formData.message}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
