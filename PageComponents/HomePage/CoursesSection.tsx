"use client";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Fab,
  useTheme,
  Box,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BacklightImage from "@/public/images/background-light.svg";
import ScatteredObject from "@/public/images/scattered-object.png";

type CourseColorKey =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

interface Course {
  title: string;
  desc: string;
  color: CourseColorKey;
  fabText: string;
}

const courses: Course[] = [
  {
    title: "Bachelor of Computer Science",
    desc: "Focuses on programming, data structures, AI, and emerging technologies.",
    color: "primary",
    fabText: "CSE",
  },
  {
    title: "Bachelor of Electrical Communication",
    desc: "Focuses on circuits, electronics, and communication technologies.",
    color: "secondary",
    fabText: "ECE",
  },
  {
    title: "Business Administration",
    desc: "Develops leadership and analytical skills for business success.",
    color: "success",
    fabText: "BA",
  },
  {
    title: "Mechanical Engineering",
    desc: "Learn advanced mechanical systems and real-world applications.",
    color: "warning",
    fabText: "ME",
  },
  {
    title: "Electrical Electronic Engineering",
    desc: "Explore electrical systems, circuits, and renewable energy.",
    color: "info",
    fabText: "EEE",
  },
  {
    title: "Civil Engineering",
    desc: "Design and construct infrastructure projects for the future.",
    color: "error",
    fabText: "CE",
  },
];

export default function CoursesSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: "#F5F5F5",
        backgroundImage: `url(${BacklightImage.src}),url(${ScatteredObject.src})`,
        backgroundSize: "cover",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack rowGap={1} pb={6}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Courses Offered
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth="md"
            mx="auto"
          >
            We offer a wide range of programs in Engineering, Science, Arts,
            Commerce, and Management. Each course blends strong academics with
            practical learning to prepare students for successful careers.
          </Typography>
        </Stack>
        <Grid container columnSpacing={3} rowSpacing={6}>
          {courses.map((course, index) => {
            const mainColor = theme.palette[course.color].main;
            const lightColor = alpha(mainColor, 0.2);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    position: "relative",
                    textAlign: "center",
                    pt: 6,
                    overflow: "visible",
                    borderRadius: 3,
                    height: "100%",
                    boxShadow: 2,
                    bgcolor: lightColor,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Fab
                    sx={{
                      position: "absolute",
                      top: -25,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      bgcolor: mainColor,
                      color: "white",
                      "&:hover": { bgcolor: mainColor },
                    }}
                  >
                    {course.fabText}
                  </Fab>

                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      color={mainColor}
                    >
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
