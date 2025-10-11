"use client";

import {
  Button,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Box,
} from "@mui/material";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import Link from "next/link";

const features = [
  "Seamless Online Admission Process",
  "Real-time Academic Progress Tracking",
  "Centralized Student Information System",
  "24/7 Secure Access for Students & Parents",
];

export default function HeroSection() {
  const theme = useTheme();
  return (
    <Stack spacing={4}>
      <Typography
        variant="h2"
        color="textPrimary"
        sx={{
          fontSize: { xs: "2rem", md: "3rem" },
          lineHeight: 1.2,
        }}
      >
        Empowering Students to{" "}
        <Typography
          component="span"
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.text.primary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          Achieve Excellence
        </Typography>{" "}
        Safely and Confidently
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Your trusted digital platform for online admissions, academic
        management, and campus engagement.
      </Typography>
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Why Choose EduPortal?
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <CheckCircleRounded color="success" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Stack alignItems={{ xs: "center", md: "flex-start" }}>
        <Link href="/student/register">
          <Button
            variant="contained"
            size="large"
            startIcon={<EmojiPeopleIcon />}
          >
            Apply for Admission
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
}
