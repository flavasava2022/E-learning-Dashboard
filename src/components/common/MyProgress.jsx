import { Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { supabase } from "../../utils/supabase";
import { showSnackbar } from "../../store/snackbarSlice";

export default function MyProgress() {
  const user = useSelector((state) => state.auth.user);
  const [completed, setCompleted] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      let completed = 0;
      let ongoing = 0;
      try {
        const { data: enrolled, error } = await supabase
          .from("enrollments")
          .select()
          .eq("user_id", user.id)

        if (error) throw error;
        if (enrolled) {
          enrolled?.map((course) => {
            course?.completed_status === "completed"
              ? (completed += 1)
              : (ongoing += 1);
          });
          setCompleted(completed);
          setOngoing(ongoing);
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, dispatch]);

  return (
    <div className="w-full">
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        My Progress
      </Typography>
      <PieChart
        sx={{
          flexDirection: "column-reverse",
          gap: 2,
          "& .MuiChartsLegend-root": {
            flexDirection: "row",
          },
        }}
        series={[
          {
            data: [
              { id: 0, value: completed, label: "completed courses" },
              { id: 1, value: ongoing, label: "ongoing courses" },
            ],
          },
        ]}
        loading={loading}
        width={250}
        height={200}
      />
    </div>
  );
}
