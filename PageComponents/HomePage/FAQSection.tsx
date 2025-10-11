"use client";

import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
} from "@mui/material";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import BacklightImage from "@/public/images/background-light.svg";

const faqs = [
  {
    question: "How do I apply for admission through EduPortal?",
    answer:
      "You can apply directly online through our admission portal. Simply create an account, fill in your details, upload the required documents, and submit the application form. You’ll receive real-time updates on your application status.",
  },
  {
    question: "Can I track my academic progress online?",
    answer:
      "Yes! Our student dashboard allows you to track grades, attendance, and assignments in real-time. You’ll also receive notifications about upcoming deadlines and events.",
  },
  {
    question: "Is EduPortal accessible on mobile devices?",
    answer:
      "Absolutely. The platform is fully responsive, meaning you can access all features from your phone, tablet, or computer with the same smooth experience.",
  },
  {
    question: "What kind of support does the college provide to new students?",
    answer:
      "We offer orientation programs, mentorship, and 24/7 digital assistance through EduPortal. Our goal is to help you transition smoothly into college life, both academically and socially.",
  },
  {
    question: "Does the campus have hostel facilities?",
    answer:
      "Yes, our campus offers modern hostel facilities with Wi-Fi, study zones, and recreational areas. Accommodation can be requested during the admission process.",
  },
  {
    question: "How does EduPortal help in placement opportunities?",
    answer:
      "EduPortal connects students with career guidance, internship alerts, and placement drives. The system keeps your resume updated and notifies you about relevant openings.",
  },
  {
    question: "Can parents access student performance details?",
    answer:
      "Parents can view academic progress and attendance through the guardian portal, ensuring transparent communication between faculty, students, and families.",
  },
];

export default function FAQSection() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${BacklightImage.src})`,
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={2} pb={4}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Frequently Asked Questions
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            maxWidth="md"
            mx="auto"
          >
            Here are some common questions about admissions, academics, and
            student life on EduPortal.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                borderRadius: 3,
                "&:before": { display: "none" },
                background: "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
              elevation={0}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandCircleDownRoundedIcon sx={{ color: "#0a2540" }} />
                }
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
