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
  Rating,
} from "@mui/material";
import dayjs from "dayjs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
export default function MyCoursesTable() {
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
      field: "students",
      headerName: "Students",
      minWidth: 100,
      type:'number',
      headerAlign: "center",
      align: "center",
    },
            {
      field: "sections",
      headerName: "Sections",
      minWidth: 100,
      type:'number',
      headerAlign: "center",
      align: "center",
    },
                {
      field: "lessons",
      headerName: "Lessons",
      minWidth: 100,
      type:'number',
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",

      renderCell: (params) => {
        const status = params.value;
        const color = status ? "success" : "warning";
        const label = status?'Published':'Ongoing';
        return <Chip label={label} color={color} />;
      },
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdDate",
      headerName: "Created At",
      type: "date",
      valueFormatter: (value) =>
        value ? dayjs(value).format("MM/DD/YYYY") : "",
      minWidth: 100, // Set minimum width

      headerAlign: "center",
      align: "center",
    },
    {
      field: "rating",
      headerName: "Rating",
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
   <Rating name="read-only" value={status} readOnly />
            </Tooltip>
          </Box>
        );
      },
      minWidth: 180,

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
      minWidth: 110,

      headerAlign: "center",
      align: "center",
    },
  ];

  console.log(tableData);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
             const { data, error } = await supabase
        .from("courses")
        .select(
          `
      *,
      categories (
        name
      ),
      users (
        first_name,last_name,avatar_url),
      modules (
        *,
        lessons (
          *
        )
      ),
      enrollments (
        user_id,
        users (
          first_name,
          last_name,
          avatar_url
        )
      )
    `
        )
        .eq("instructor_id", user?.id);
        if (!data || data.length === 0) {
          setTableData([]);
          return;
        }
        const rows = data?.map((course) => {


            const totalLessons = course.modules.reduce(
              (acc, module) => acc + (module.lessons?.length || 0),
              0
            );
const studentNum = course.enrollments.length||0
const modulesNum = course?.modules.length||0



            return {
              id: course.id,
              title: course.title,
              students: studentNum,
              sections:modulesNum,
              lessons:totalLessons,
              status: course?.published,
              createdDate: course?.created_at,
              rating: course?.rating,
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
        My Courses
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
          sx={{ mb: 1 }}
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
