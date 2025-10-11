"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Stack,
} from "@mui/material";
import Infrastructure from "@/public/images/infrastructure.png";
import StudentActivities from "@/public/images/student-activities.png";
import GreenCampus from "@/public/images/green-campus.png";
import Research from "@/public/images/research.png";
import Library from "@/public/images/library.png";
import SmartRoom from "@/public/images/smart-room.jpg";
import BacklightImage from "@/public/images/background-light.svg";
import ClassRoom from "@/public/images/class-room.jpg";
import Hospital from "@/public/images/hospital.jpg";

const campusData = [
  {
    image: Infrastructure.src,
    title: "Modern Infrastructure",
    desc: "Smart classrooms, labs, and digital libraries for 21st-century learning.",
  },
  {
    image: StudentActivities.src,
    title: "Student Activities",
    desc: "Sports, cultural fests, and clubs that shape confident individuals.",
  },
  {
    image: GreenCampus.src,
    title: "Green Campus",
    desc: "Eco-friendly spaces that promote sustainable learning and wellbeing.",
  },
  {
    image: Research.src,
    title: "Research & Innovation",
    desc: "Encouraging innovative projects and research opportunities.",
  },
  {
    image: SmartRoom.src,
    title: "Smart Classrooms",
    desc: "Technology-enabled classrooms for interactive learning.",
  },
  {
    image: Library.src,
    title: "Extensive Library",
    desc: "Huge collection of books, journals, and e-resources for students.",
  },
  {
    image: ClassRoom.src,
    title: "Classroom Experience",
    desc: "Collaborative learning environment that inspires creativity and curiosity.",
  },
  {
    image: Hospital.src,
    title: "Campus Hospital",
    desc: "On-campus medical center providing 24/7 healthcare, emergency support, and wellness programs for students and staff.",
  },
];

export default function AboutCollegeSection() {
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
            About Our College
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth="md"
            mx="auto"
            variant="body1"
          >
            EduPortal College is a premier institution dedicated to academic
            excellence, innovation, and holistic development. With
            state-of-the-art facilities and an experienced faculty, we empower
            students to become leaders in their respective fields.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {campusData.map((life, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
                component={Stack}
              >
                <Box height={230}>
                  <CardMedia
                    component="img"
                    image={life.image}
                    alt={life.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {life.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {life.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
