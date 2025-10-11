"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BacklightImage from "@/public/images/background-light.svg";
import ScatteredObject from "@/public/images/scattered-object.png";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        pt: 6,
        pb: 1,
        background: "#F5F5F5",
        backgroundImage: `url(${BacklightImage.src}),url(${ScatteredObject.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              EduPortal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              EduPortal is a premier digital platform for online admissions and
              student management. We provide secure, efficient, and modern
              solutions for students and parents.
            </Typography>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" underline="hover" color="text.secondary">
                Home
              </Link>
              <Link
                href="/student/register"
                underline="hover"
                color="text.secondary"
              >
                Admission
              </Link>
              <Link href="/courses" underline="hover" color="text.secondary">
                Courses
              </Link>
              <Link href="/contact" underline="hover" color="text.secondary">
                Contact
              </Link>
            </Stack>
          </Grid>

          {/* Social / Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Connect With Us
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton href="#" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" color="primary">
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" color="primary">
                <LinkedInIcon />
              </IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Email: info@eduportal.com <br />
              Phone: +91 9876543210
            </Typography>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} <Link>EduPortal</Link>. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
