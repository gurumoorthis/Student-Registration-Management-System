"use client";

import { Button, Typography, Stack, Paper } from "@mui/material";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useRouter } from "next/navigation";

// SwiperJS imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import StudentLayout from "@/GlobalComponents/layout/StudentLayout";

const studentSlides = [
  {
    title: "Easy Online Admission",
    description:
      "Fill out the admission form online and track your status easily.",
  },
  {
    title: "Track Student Progress",
    description:
      "Monitor your grades, attendance, and academic progress in one place.",
  },
  {
    title: "Secure Data Management",
    description:
      "All student data is safe, secure, and easily accessible anytime.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  return (
    <StudentLayout>
      <Stack spacing={4}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #FF7E5F, #FEB47B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to EduPortal
        </Typography>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          loop
        >
          {studentSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {slide.title}
                </Typography>
                <Typography variant="body1">{slide.description}</Typography>
              </Paper>
            </SwiperSlide>
          ))}
        </Swiper>
        <Stack alignItems="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<EmojiPeopleIcon />}
            onClick={() => router.push("/student/register")}
          >
            Admission Form
          </Button>
        </Stack>
      </Stack>
    </StudentLayout>
  );
}
