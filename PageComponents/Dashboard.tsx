"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography, Skeleton } from "@mui/material";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { supabase } from "@/supabaseClient";
import moment from "moment";
import { Diversity3Rounded, PeopleAltRounded } from "@mui/icons-material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [usersRolePie, setUsersRolePie] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [studentsDeptBar, setStudentsDeptBar] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [studentsGenderPie, setStudentsGenderPie] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [registrationsLine, setRegistrationsLine] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Users
        const { data: usersData } = await supabase.from("users").select("*");
        setUsers(usersData || []);

        // Fetch Students
        const { data: studentsData } = await supabase
          .from("students")
          .select("*");
        setStudents(studentsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Users by Role
  useEffect(() => {
    if (!users.length) return;
    const roleCount: Record<string, number> = {};
    users.forEach((u) => {
      const role = u.role || "Unknown";
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    setUsersRolePie({
      labels: Object.keys(roleCount),
      datasets: [
        {
          label: "Users by Role",
          data: Object.values(roleCount),
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
          borderColor: ["#1D4ED8", "#047857", "#B45309"],
          borderWidth: 1,
        },
      ],
    });
  }, [users]);

  // Students by Department
  useEffect(() => {
    if (!students.length) return;
    const deptCount: Record<string, number> = {};
    students.forEach((s) => {
      const dept = s.department || "Unknown";
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });
    setStudentsDeptBar({
      labels: Object.keys(deptCount),
      datasets: [
        {
          label: "Students by Department",
          data: Object.values(deptCount),
          backgroundColor: "#3B82F6",
        },
      ],
    });
  }, [students]);

  // Students Gender Distribution
  useEffect(() => {
    if (!students.length) return;
    const genderCount: Record<string, number> = {};
    students.forEach((s) => {
      const gender = s.gender || "Other";
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });
    setStudentsGenderPie({
      labels: Object.keys(genderCount),
      datasets: [
        {
          label: "Gender Distribution",
          data: Object.values(genderCount),
          backgroundColor: ["#60A5FA", "#FBBF24", "#34D399"],
          borderColor: ["#3B82F6", "#F59E0B", "#10B981"],
          borderWidth: 1,
        },
      ],
    });
  }, [students]);

  // Users & Students Registration Over Time
  useEffect(() => {
    if (!users.length && !students.length) return;

    const monthLabels = Array.from({ length: 12 }, (_, i) =>
      moment().month(i).format("MMM")
    );
    const userCounts = monthLabels.map(
      (month, idx) =>
        users.filter((u) => moment(u.created_at).month() === idx).length
    );
    const studentCounts = monthLabels.map(
      (month, idx) =>
        students.filter((s) => moment(s.created_at).month() === idx).length
    );

    setRegistrationsLine({
      labels: monthLabels,
      datasets: [
        {
          label: "Users",
          data: userCounts,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.3)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Students",
          data: studentCounts,
          borderColor: "#10B981",
          backgroundColor: "rgba(16,185,129,0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  }, [users, students]);

  return (
    <Grid container spacing={3}>
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Stack className="bg-white p-4 rounded-xl shadow">
              <Skeleton width="60%" />
              <Skeleton height={200} />
            </Stack>
          </Grid>
        ))
      ) : (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              className="p-4 rounded-xl shadow"
              bgcolor="#4caf5087"
              rowGap={2}
            >
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Diversity3Rounded color="success" />
                <Typography variant="h6" fontWeight="bold">
                  Total Students
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold">
                {students.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              className="p-4 rounded-xl shadow"
              bgcolor="#ff9800a1"
              rowGap={2}
            >
              <Stack direction="row" alignItems="center" gap={1.5}>
                <PeopleAltRounded color="warning" />
                <Typography variant="h6" fontWeight="bold">
                  Total Users Registered
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold">
                {students.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-white p-4 rounded-xl shadow" height="100%">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Users by Role
              </Typography>
              <Pie data={usersRolePie} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-white p-4 rounded-xl shadow" height="100%">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Students by Department
              </Typography>
              <Bar data={studentsDeptBar} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-white p-4 rounded-xl shadow" height="100%">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Students Gender Distribution
              </Typography>
              <Pie data={studentsGenderPie} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="bg-white p-4 rounded-xl shadow" height="100%">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Registrations Over Time
              </Typography>
              <Line data={registrationsLine} />
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
}
