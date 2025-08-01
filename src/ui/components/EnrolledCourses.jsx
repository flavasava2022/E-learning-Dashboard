import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chip,
  LinearProgress,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
export default function EnrolledCourses() {
  const user = useSelector((state) => state.auth.user);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const columns = [
    {
      field: "title",
      headerName: "Course Name",
      minWidth: 180,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "instructor",
      headerName: "Instructor",
      minWidth: 160,

      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",

      renderCell: (params) => {
        const status = params.value;
        const color = status === "completed" ? "success" : "warning";
        const label = status;
        return <Chip label={label} color={color} sx={{ borderRadius: 2 }} />;
      },
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "enrollDate",
      headerName: "Enrolled At",
      type: "date",
      valueFormatter: (value) =>
        value ? dayjs(value).format("MM/DD/YYYY") : "",
      minWidth: 100, // Set minimum width

      headerAlign: "center",
      align: "center",
    },
    {
      field: "progress",
      headerName: "Progress",
      // The renderCell function receives params and returns a React element.
      renderCell: (params) => {
        const status = params.value;
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title={status != null ? status.toFixed(0) : ""}>
              <LinearProgress
                variant="determinate"
                value={status}
                sx={{ width: 90, minWidth: 60, borderRadius: 2, mx: 1 }}
              />
            </Tooltip>
          </Box>
        );
      },
      minWidth: 120,

      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",

      renderCell: (params) => {
        return (
          <IconButton
            edge="start"
            color="primary"
            aria-label="View Course"
            onClick={() => navigate(`/dashboard/courses/${params.id}`)}
          >
            <RemoveRedEyeIcon />
          </IconButton>
        );
      },
 

      headerAlign: "center",
      align: "center",
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data: enrollments, error: enrollError } = await supabase
          .from("enrollments")
          .select("enrolled_at, completed_status, course_id")
          .eq("user_id", user?.id);

        if (enrollError) throw enrollError;
        if (!enrollments || enrollments.length === 0) {
          setTableData([]);
          return;
        }

        const courseIds = enrollments.map((e) => e.course_id);

        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select(
            `id, title, users(first_name, last_name), progress(lesson_id), modules(lessons(id))`
          )
          .in("id", courseIds);

        if (coursesError) throw coursesError;

        const rows = enrollments
          .map((enrollment) => {
            const course = coursesData.find(
              (c) => c.id === enrollment.course_id
            );
            if (!course) return null;

            const totalLessons = course.modules.reduce(
              (acc, module) => acc + (module.lessons?.length || 0),
              0
            );
            const completedLessons = course.progress?.length || 0;

            const progressPercentage =
              totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            const instructor =
              `${course.users?.first_name || ""} ${course.users?.last_name || ""}`.trim();

            return {
              id: course.id,
              title: course.title,
              instructor: instructor,
              status: enrollment.completed_status,
              enrollDate: enrollment.enrolled_at,
              progress: progressPercentage,
            };
          })
          .filter(Boolean);

        setTableData(rows);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCourses();
    } else {
      setLoading(false);
      setTableData([]);
    }
  }, [user]);
  return (
    <Box sx={{ width: "100%", p: 2, boxSizing: "border-box" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Enrolled Courses
      </Typography>
      {/* FIX: Add a container with a defined height */}
      {isMobile ? (
        <Box>
          {loading ? (
            <Typography>Loading courses...</Typography>
          ) : (
            tableData.map((course) => (
              <MobileCourseCard key={course.id} course={course} />
            ))
          )}
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DataGrid
            sx={{
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              },
            }}
            rows={tableData}
            columns={columns}
            loading={loading} // FIX: Use the loading state
            disableRowSelectionOnClick
            disableColumnMenu
          />
        </Box>
      )}
    </Box>
  );
}

const MobileCourseCard = ({ course }) => {
  return (
    <Card sx={{ mb: 2, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {course.title}
        </Typography>
        <Chip
          label={course.status}
          color={course.status === "completed" ? "success" : "warning"}
          size="small"
          sx={{ borderRadius: 2, mb: 1 }}
        />
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          <strong>Instructor:</strong> {course.instructor}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          <strong>Enrolled:</strong>{" "}
          {dayjs(course.enrollDate).format("MMM D, YYYY")}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Progress
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", width: "100%", mb: 2 }}
        >
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={course.progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {`${Math.round(course.progress)}%`}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => alert(`Viewing course: ${course.title}`)}
        >
          View Course
        </Button>
      </CardContent>
    </Card>
  );
};
