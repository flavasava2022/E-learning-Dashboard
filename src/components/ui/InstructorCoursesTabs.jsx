import { useEffect, useState, useCallback } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GridViewIcon from "@mui/icons-material/GridView";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabase";
import CourseCard from "../common/CourseCard";
import { useMediaQuery } from "@mui/material"; 

export default function InstructorCoursesTabs({ id }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusTab, setStatusTab] = useState(0); 
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);

  const pageSize = 8;
  const pageCount = Math.ceil(courses.length / pageSize);
  const paginatedCourses = courses.slice((page - 1) * pageSize, page * pageSize);

  const fetchCourses = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", id)
        .eq("published", statusTab === 0);

      if (error) throw error;
      setCourses(data || []);
      setPage(1); // Reset pagination when tab changes
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    } finally {
      setLoading(false);
    }
  }, [id, statusTab]);


  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleTabChange = (_, newValue) => {
    setStatusTab(newValue);
  };

  const handleViewChange = (_, newView) => {
    if (newView) setViewMode(newView);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" className="w-full rounded-xl shadow p-1">
      {/* Tabs */}
      <Tabs value={statusTab} onChange={handleTabChange} sx={{ flexShrink: 0 }}>
        <Tab label="Published" />
        <Tab label="Ongoing" />
      </Tabs>


      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} flexShrink={0}>
        {isMobile ? (
          <IconButton onClick={() => navigate("/dashboard/mycourses/create")}>
            <AddIcon sx={{ color: "#2d9cdb" }} />
          </IconButton>
        ) : (
          <Button variant="contained" onClick={() => navigate("/dashboard/mycourses/create")}>
            Create New Course
          </Button>
        )}

        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange}>
          <ToggleButton value="list"><ViewHeadlineIcon /></ToggleButton>
          <ToggleButton value="grid"><GridViewIcon /></ToggleButton>
        </ToggleButtonGroup>
      </Box>


      <Box flex={1} minHeight={0} overflow="auto" p={1}>
        {loading ? (
          <Box minHeight={300} display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {paginatedCourses.map(course => (
              <Grid
                item
                key={course.id}
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "grid" ? 4 : 12}
                lg={viewMode === "grid" ? 3 : 12}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  width: viewMode === "list" ? "100%" : "auto",
                }}
              >
                <CourseCard id={course.id} alignment={viewMode} page="mycourses" />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" p={2} flexShrink={0}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
