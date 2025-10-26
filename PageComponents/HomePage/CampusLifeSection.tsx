"use client";

import { Box, Container, Typography, Paper, Stack, Fab } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Festival from "@/public/images/festival-celeberation.jpg";
import ModernHostel from "@/public/images/modern-hostel.jpg";
import Sports from "@/public/images/sports.png";
import Innovation from "@/public/images/innovation.jpg";
import Community from "@/public/images/community.jpg";
import Career from "@/public/images/career.jpg";
import BacklightImage from "@/public/images/background-light.svg";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";

// Use these images in the highlights array
const collegeHighlights = [
  {
    title: "Cultural Fest & Celebrations",
    description:
      "Experience diverse cultures through annual fests, music nights, and inter-college competitions that bring the campus alive.",
    image: Festival.src,
  },
  {
    title: "Modern Hostel Facilities",
    description:
      "Comfortable and secure hostels offering a perfect balance of privacy and community living for students.",
    image: ModernHostel.src,
  },
  {
    title: "Sports & Fitness",
    description:
      "World-class sports complex, gym, and fitness programs encouraging students to stay active and healthy.",
    image: Sports.src,
  },
  {
    title: "Innovation & Entrepreneurship",
    description:
      "Dedicated incubation center to support startups, creative ideas, and student-led ventures.",
    image: Innovation.src,
  },
  {
    title: "Community Engagement",
    description:
      "Students actively participate in outreach programs, volunteering, and social responsibility initiatives.",
    image: Community.src,
  },
  {
    title: "Career Development",
    description:
      "Workshops, internships, and placement training to prepare students for global career opportunities.",
    image: Career.src,
  },
];

export default function CampusLifeSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <Box
      sx={{
        backgroundImage: `url(${BacklightImage.src})`,
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack rowGap={1} pb={4}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Campus Life
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth="md"
            mx="auto"
          >
            Our campus life offers a balanced blend of academics and
            extracurricular activities. Participate in clubs, cultural events,
            and sports while connecting with peers and alumni. We focus on
            holistic development, ensuring students grow academically, socially,
            and personally.
          </Typography>
        </Stack>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          loop
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
          style={{
            paddingBottom: "40px",
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {collegeHighlights.map((highlight, index) => (
            <SwiperSlide key={index}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={highlight.image}
                  alt={highlight.title}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "40%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                  }}
                />
                <Stack
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    p: 2,
                    color: "white",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {highlight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {highlight.description}
                  </Typography>
                </Stack>
              </Paper>
            </SwiperSlide>
          ))}
        </Swiper>
        <Stack direction="row" justifyContent="center" gap={2} pt={1}>
          <Fab
            size="large"
            sx={{
              backgroundColor: "text.primary",
              "&:hover": {
                backgroundColor: "text.primary",
              },
            }}
            onClick={() => swiperRef?.current?.slidePrev()}
          >
            <ArrowBackIosNewRoundedIcon sx={{ color: "#FFFFFF" }} />
          </Fab>
          <Fab
            size="large"
            sx={{
              backgroundColor: "text.primary",
              "&:hover": {
                backgroundColor: "text.primary",
              },
            }}
            
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowForwardIosRoundedIcon sx={{ color: "#FFFFFF" }} />
          </Fab>
        </Stack>
      </Container>
    </Box>
  );
}
