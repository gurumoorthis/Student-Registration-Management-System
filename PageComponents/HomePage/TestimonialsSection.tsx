"use client";

import {
  Container,
  Typography,
  Grid,
  Stack,
  Box,
  Rating,
  Divider,
  Breadcrumbs,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
} from "@mui/material";
import BacklightImage from "@/public/images/background-light.svg";
import ScatteredObject from "@/public/images/scattered-object.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import MenAnimate from "@/public/images/men-animate.png";
import GirlAnimate from "@/public/images/girl-animate.png";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import React, { useRef } from "react";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import type { Swiper as SwiperType } from "swiper";

const testimonials = [
  {
    name: "Rahul Sharma",
    place: "Mumbai, India",
    rating: 5,
    image: MenAnimate.src, // profile image
    reviewImages: [MenAnimate.src, MenAnimate.src],
    message: "EduPortal made my admission and learning experience seamless!",
    review: [
      {
        title: "Seamless Experience",
        content: "EduPortal made admission and learning seamless!",
      },
      {
        title: "Top-notch Infrastructure",
        content: "Amazing faculty and infrastructure.",
      },
      {
        title: "Loved It",
        content: "🎓👍",
      },
    ],
    chip: "Admission & Learning",
    breadcrumbs: ["College", "Student Testimonials", "Rahul Sharma"],
  },
  {
    name: "Sneha Patel",
    place: "Delhi, India",
    rating: 4,
    image: GirlAnimate.src, // profile image
    reviewImages: [MenAnimate.src, MenAnimate.src],
    message: "I love the digital platform; it keeps me updated in real time.",
    review: [
      {
        title: "User Friendly",
        content: "I love the digital platform.",
      },
      {
        title: "Real-time Updates",
        content: "Easy to track grades and attendance in real time.",
      },
      {
        title: "Helpful Tips",
        content: "Notifications keep me updated constantly.",
      },
    ],
    chip: "Digital Platform",
    breadcrumbs: ["College", "Student Feedback", "Sneha Patel"],
  },
  {
    name: "Amit Kumar",
    place: "Bangalore, India",
    rating: 5,
    image: MenAnimate.src, // profile image
    reviewImages: [MenAnimate.src, MenAnimate.src],
    message:
      "Great staff, encouraging environment, and overall a fun campus life!",
    review: [
      {
        title: "Great Experience",
        content: "Great experience!",
      },
      {
        title: "Supportive Staff",
        content: "The staff is helpful and supportive.",
      },
      {
        title: "Encouraging Environment",
        content: "The environment encourages growth and learning.",
      },
      {
        title: "Fun",
        content: "🌟📚",
      },
    ],
    chip: "Campus Life",
    breadcrumbs: ["College", "Campus Life", "Amit Kumar"],
  },
];

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <Box
      sx={{
        background: "#F5F5F5",
        backgroundImage: `url(${BacklightImage.src}),url(${ScatteredObject.src})`,
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack rowGap={1} pb={4}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            What Our Students Say
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth="md"
            mx="auto"
          >
            Hear directly from our students about their experiences on campus —
            from engaging classes and vibrant student life to supportive faculty
            and opportunities that shaped their growth and success.
          </Typography>
        </Stack>
        <Container maxWidth="lg" sx={{ px: "0px !important" }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            spaceBetween={30}
            loop
            style={{
              paddingBottom: "40px",
            }}
          >
            {testimonials.map((highlight, index) => (
              <SwiperSlide key={index}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
                    <Box
                      component="img"
                      src={highlight.image}
                      alt={highlight.name}
                      sx={{
                        height: 250,
                        width: 250,
                        objectFit: "cover",
                        display: "block",
                        borderRadius: 3,
                        background: "#F9F9F9",
                      }}
                    />
                    <Stack>
                      <Typography variant="h6" fontWeight="bold">
                        {highlight.name}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {highlight.place}
                      </Typography>
                      <Rating
                        value={highlight.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" color="textSecondary">
                        {highlight.message}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
                    <Stack gap={1}>
                      <Stack direction="row" flexWrap="wrap" gap={2}>
                        <Box
                          sx={{
                            bgcolor: "#ddd",
                            p: 0.5,
                            borderRadius: 6,
                            boxShadow: 2,
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Breadcrumbs
                            separator={
                              <DoubleArrowRoundedIcon
                                sx={{ fontSize: "12px", color: "#0a2540" }}
                              />
                            }
                            sx={{
                              "& .MuiBreadcrumbs-separator": {
                                p: 0.5,
                                borderRadius: "16px",
                                mx: "0px",
                              },
                              "& .MuiBreadcrumbs-li": {
                                fontSize: "12px",
                                background: "#FFFFFF",
                                px: 1,
                                py: 0.5,
                                borderRadius: "16px",
                              },
                              "& .MuiBreadcrumbs-li:last-of-type": {
                                background: "#0a2540",
                                color: "#FFFFFF",
                              },
                              "& .MuiBreadcrumbs-ol": {
                                rowGap: 1,
                              },
                            }}
                          >
                            {highlight.breadcrumbs.map((breadcrumb, index) => (
                              <React.Fragment key={index}>
                                {breadcrumb}
                              </React.Fragment>
                            ))}
                          </Breadcrumbs>
                        </Box>
                        <Chip label={highlight.chip} color="success" />
                      </Stack>
                      {highlight.review.map((r, index) => (
                        <Accordion
                          expanded
                          key={index}
                          sx={{
                            borderRadius: 3,
                            "&:before": { display: "none" },
                            m: "0px !important",
                          }}
                          elevation={0}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandCircleDownRoundedIcon
                                sx={{ color: "#0a2540" }}
                              />
                            }
                            sx={{
                              "& .MuiAccordionSummary-content": {
                                mt: "6px !important",
                                mb: "0px !important",
                              },
                              minHeight: "0px !important",
                              px: 1,
                            }}
                          >
                            <Typography
                              color="textSecondary"
                              variant="subtitle2"
                            >
                              {r.title}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 1 }}>
                            <Typography color="textPrimary" variant="subtitle2">
                              {r.content}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      <Accordion
                        expanded
                        sx={{
                          borderRadius: "12PX !important",
                          "&:before": { display: "none" },
                          m: "0px !important",
                        }}
                        elevation={0}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandCircleDownRoundedIcon
                              sx={{ color: "#0a2540" }}
                            />
                          }
                          sx={{
                            "& .MuiAccordionSummary-content": {
                              mt: "6px !important",
                              mb: "0px !important",
                            },
                            minHeight: "0px !important",
                            px: 1,
                          }}
                        >
                          <Typography color="textSecondary" variant="subtitle2">
                            Campus Life Highlights
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 1 }}>
                          <Stack direction="row" gap={0.5} flexWrap="wrap">
                            {highlight.reviewImages.map((url, key) => {
                              return (
                                <Box
                                  key={key}
                                  component="img"
                                  src={url}
                                  alt={url}
                                  sx={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 2,
                                  }}
                                />
                              );
                            })}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </Stack>
                  </Grid>
                </Grid>
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
              onClick={() => swiperRef.current?.slideNext()}
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
              onClick={() => swiperRef?.current?.slidePrev()}
            >
              <ArrowForwardIosRoundedIcon sx={{ color: "#FFFFFF" }} />
            </Fab>
          </Stack>
        </Container>
      </Container>
    </Box>
  );
}
