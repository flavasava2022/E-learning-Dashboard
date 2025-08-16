import { BarChart, LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";

export default function StudyStatistics() {
  const user = useSelector((state) => state.auth.user);
  const xAxis = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user?.id) return; // guard clause for undefined user

    async function fetchProgress() {
      const progressData = Array(12).fill(0); // initialize array for 12 months, all zeroes
      setLoading(true);
      const { data, error } = await supabase
        .from("progress")
        .select("completed_at,duration_minutes")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching progress:", error);
        setData(progressData);
        return;
      }

      if (data) {
        data.forEach(({ completed_at, duration_minutes }) => {
          if (completed_at) {
            const month = dayjs(completed_at).month(); // 0-based month index
            progressData[month] += duration_minutes;
          }
        });
      }
      const hoursData = progressData.map((minutes) => Math.ceil(minutes / 60));
      setData(hoursData);
      setLoading(false);
    }

    fetchProgress();
  }, [user]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Study Statistics
      </Typography>
      <BarChart
        xAxis={[{ data: xAxis }]}
        series={[
          {
            data: data,
          },
        ]}
        yAxis={[
          {
            width: 20, // Narrow the y-axis reserved width
            label: "", // Remove y-axis label text
            tickLabelStyle: { fontSize: 10 }, // Optionally smaller tick labels
          },
        ]}
        margin={{ left: 0 }}
        borderRadius={6}
        height={300}
        loading={loading}
      />
    </Box>
  );
}
