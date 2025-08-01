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
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarIcon from "@mui/icons-material/Star";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

import EditIcon from "@mui/icons-material/Edit";
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
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sections",
      headerName: "Sections",

      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lessons",
      headerName: "Lessons",

      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",

      renderCell: (params) => {
        const status = params.value;
        const color = status ? "success" : "warning";
        const label = status ? "Published" : "Ongoing";
        return <Chip sx={{ borderRadius: 2 }} label={label} color={color} />;
      },

      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdDate",
      headerName: "Created At",
      type: "date",
      valueFormatter: (value) =>
        value ? dayjs(value).format("MM/DD/YYYY") : "",
 

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
            <Rating name="read-only" value={status} readOnly />
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              edge="start"
              color="primary"
              aria-label="View Course"
              onClick={() => navigate(`/dashboard/courses/${params.id}`)}
            >
              <RemoveRedEyeIcon />
            </IconButton>
            <IconButton
              edge="start"
              color="primary"
              aria-label="View Course"
              onClick={() => navigate(`/dashboard/courses/${params.id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Box>
        );
      },
      minWidth: 110,

      headerAlign: "center",
      align: "center",
    },
  ];

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
        const rows = data
          ?.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, module) => acc + (module.lessons?.length || 0),
              0
            );
            const studentNum = course.enrollments.length || 0;
            const modulesNum = course?.modules.length || 0;

            return {
              id: course.id,
              title: course.title,
              students: studentNum,
              sections: modulesNum,
              lessons: totalLessons,
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
        <div style={{ display: "flex", flexDirection: "column" }}>
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
        </div>
      )}
    </Box>
  );
}

const MobileCourseCard = ({ course }) => {
  console.log(course);
  const navigate = useNavigate();
  return (
    <Card sx={{ mb: 2, width: "100%" }}>
      <CardContent >
        <Typography variant="h6" component="div" gutterBottom>
          {course.title}
        </Typography>
        <Chip
          sx={{ borderRadius: 2, mb: 1 }}
          label={course?.status ? "Published" : "Ongoing"}
          color={course?.status ? "success" : "warning"}
          size="small"
        />
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          <strong>Created:</strong>{" "}
          {dayjs(course.enrollDate).format("MMM D, YYYY")}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent='center' spacing={3} sx={{ mb: 2 }}>
<Tooltip title='Sections'>
            <Stack direction="row" alignItems="center" spacing={1}>
            <MenuBookIcon fontSize="small" sx={{ color: "#2d9cdb" }} />
            <Typography variant="body2" color="text.secondary">
              {course?.sections ?? 0}
            </Typography>

          </Stack>
</Tooltip>
<Tooltip title='Lectures'>



          <Stack direction="row" alignItems="center" spacing={1}>
            <LibraryBooksOutlinedIcon fontSize="small" sx={{ color: "#2d9cdb" }} />
            <Typography variant="body2" color="text.secondary">
              {course?.lessons ?? 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", md: "block" } }}
              color="text.secondary"
            >
              Lectures
            </Typography>
            

          </Stack>
          </Tooltip>
                      <Tooltip title='Enrolled'>
                        <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleAltOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course?.students ?? 0}
                </Typography>
              </Stack>
              </Tooltip>
              <Tooltip title='Rating'>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
            <Typography variant="body2" color="text.secondary">
              {course?.rating ?? 0}
            </Typography>

          </Stack>
          </Tooltip>
        </Stack>

<Box sx={{display:'flex',alignItems:'center' ,justifyContent:'space-between'}}>
          <Button
          variant="contained"
          size="small"
          onClick={() => navigate("/dashboard/courses/${course?.id}")}
        >
          View Course
        </Button>
                <Button
          variant="contained"
          size="small"
          onClick={() => navigate("/dashboard/courses/${course?.id}")}
        >
          View Course
        </Button>
</Box>
      </CardContent>
    </Card>
  );
};
