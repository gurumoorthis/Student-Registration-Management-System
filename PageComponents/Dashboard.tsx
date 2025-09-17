"use client";

import PageTitle from "@/GlobalComponents/PageTitle";
import { useAppDispatch } from "@/redux/hooks";
import {
  getCoverageByType,
  getCoverageData,
  getPoliciesByTypeStatusByUser,
  getPremiumSumByType,
} from "@/redux/slice/DashboardSlice";
import type { RootState } from "@/redux/store";
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
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
import moment from "moment";
import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";

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

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Coverage Amount ($)",
      },
    },
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
  },
};

const stackedBarOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: "Number of Policies",
      },
    },
  },
};

interface stackedBarChartDataSetsProps {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface pieDataProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

const statusColors: Record<string, string> = {
  active: "#4ADE80",
  lapsed: "#FACC15",
  cancelled: "#F87171",
};

const types = ["life", "health", "auto"];
const statuses = ["active", "lapsed", "cancelled"];
interface LineChartDataset {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

interface BarChartDataset {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function Dashboard() {
  const userId = secureLocalStorage.getItem("user_id") as string;
  const {
    policyCountsByTypeStatus,
    coverageData,
    coverageTypeData,
    premiumByType,
  } = useSelector((state: RootState) => state.DASHBOARD);
  const dispatch = useAppDispatch();
  const [stackedBarChartData, setStackedBarChartData] = useState<{
    labels: string[];
    datasets: stackedBarChartDataSetsProps[];
  }>({
    labels: types,
    datasets: [],
  });
  const [lineData, setLineData] = useState<LineChartDataset>({
    labels: [],
    datasets: [
      {
        label: "Total Coverage ($)",
        data: [],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  });
  const [barData, setBarData] = useState<BarChartDataset>({
    labels: [],
    datasets: [],
  });
  const [pieData, setPieData] = useState<pieDataProps>({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (premiumByType.length > 0) {
      const labels = premiumByType.map((item) => item.type);
      const data = premiumByType.map((item) => Number(item.total_premium));

      const colors = ["#60A5FA", "#34D399", "#FBBF24"];
      const borders = ["#3B82F6", "#10B981", "#F59E0B"];

      setPieData({
        labels,
        datasets: [
          {
            label: "Total Premium ($)",
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: borders.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [premiumByType]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) return;
      try {
        await dispatch(getPoliciesByTypeStatusByUser(userId));
        await dispatch(getCoverageData(userId));
        await dispatch(getCoverageByType(userId));
        await dispatch(getPremiumSumByType());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [dispatch, userId]);

  useEffect(() => {
    const datasets = statuses.map((status) => ({
      label: status,
      data: types.map((type) => {
        const match = policyCountsByTypeStatus.find(
          (item) => item.type === type && item.status === status
        );
        return match ? match.count : 0;
      }),
      backgroundColor: statusColors[status],
    }));

    setStackedBarChartData({
      labels: types,
      datasets,
    });
  }, [policyCountsByTypeStatus]);

  useEffect(() => {
    if (coverageTypeData.length > 0) {
      setBarData({
        labels: coverageTypeData.map((item: { month: string }) =>
          moment(item.month).format("MMM")
        ),
        datasets: [
          {
            label: "Total Coverage ($)",
            data: coverageTypeData.map(
              (item: { total_coverage: number }) => item.total_coverage
            ),
            backgroundColor: "#3b82f6",
          },
        ],
      });
    }
  }, [coverageTypeData]);

  useEffect(() => {
    if (Object.keys(coverageData).length > 0) {
      setLineData({
        labels: coverageData.map((item: { month: string }) =>
          moment(item.month).format("MMM")
        ),
        datasets: [
          {
            label: "Total Coverage ($)",
            data: coverageData.map(
              (item: { total_coverage: number }) => item.total_coverage
            ),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    }
  }, [coverageData]);

  const sections = [
    "Policy Distribution by Region",
    "Monthly New Policies by Category",
    "Total Coverage Amount Over Time",
    "Policy Count by Type and Status",
  ];

  return (
    <>
      {isLoading ? (
        <Grid container spacing={3}>
          {sections.map((title) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={title}>
              <Stack
                className="bg-white p-4 rounded-2xl shadow"
                sx={{ height: "100%" }}
                justifyContent="space-between"
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {title}
                </Typography>
                <Skeleton className="w-full h-50" />
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container>
          <Box className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="subtitle1" fontWeight="bold">
              Policy Distribution by Region
            </Typography>
            <Pie data={pieData} />
          </Box>
          <Box className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="subtitle1" fontWeight="bold">
              Monthly New Policies by Category
            </Typography>
            <Bar data={barData} />
          </Box>
          <Box className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="subtitle1" fontWeight="bold">
              Total Coverage Amount Over Time
            </Typography>
            <Line data={lineData} options={lineOptions} />
          </Box>
          <Box className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="subtitle1" fontWeight="bold">
              Policy Count by Type and Status
            </Typography>
            <Bar data={stackedBarChartData} options={stackedBarOptions} />
          </Box>
        </Grid>
      )}
    </>
  );
}
