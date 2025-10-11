"use client";

import { Box, Container, Grid } from "@mui/material";
import StudentLayout from "@/GlobalComponents/layout/StudentLayout";
import HeroSection from "@/PageComponents/HomePage/HeroSection";
import LeadForm from "@/GlobalComponents/LeadForm";
import AboutCollegeSection from "@/PageComponents/HomePage/AboutCollegeSection";
import CoursesSection from "@/PageComponents/HomePage/CoursesSection";
import CampusLifeSection from "@/PageComponents/HomePage/CampusLifeSection";
import TestimonialsSection from "@/PageComponents/HomePage/TestimonialsSection";
import CallToActionSection from "@/PageComponents/HomePage/CallToActionSection";
import BacklightImage from "@/public/images/background-light.svg";
import FAQSection from "@/PageComponents/HomePage/FAQSection";

export default function LandingPage() {
  return (
    <StudentLayout>
      <Box
        sx={{
          backgroundImage: `url(${BacklightImage.src}),linear-gradient(85deg, #ccf7ff 39%, #0a25404d 78%, #0a254021)`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <HeroSection />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <LeadForm />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <AboutCollegeSection />
      <CoursesSection />
      <CampusLifeSection />
      <TestimonialsSection />
      <CallToActionSection />
      <FAQSection />
    </StudentLayout>
  );
}
