import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GridViewIcon from "@mui/icons-material/GridView";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabase";
import CourseCard from "./CourseCard";
import { useMediaQuery } from "react-responsive";

export default function InstructorCoursesTabs({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalCourses = data.length;
  const pageCount = Math.ceil(totalCourses / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  async function fetchData(published) {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", id)
        .eq("published", published);
      if (error) {
        console.error(error);
      } else {
        setData(data);
      }
    } finally {
      setLoading(false);
      setPage(1);
    }
  }
  const [alignment, setAlignment] = useState("grid");
  const handleChange = (event, newValue) => {
    setValue(newValue);
    newValue === 0 ? fetchData(true) : fetchData(false);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchData(true);
    }
  }, [id]);
  return (
    // 1. Set the main container to be a flex column
    <div
      className="w-full rounded-xl shadow p-1"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={{  flexShrink: 0 }} // Prevent tabs from shrinking
      >
        <Tab label="published" />
        <Tab label="ongoing" />
      </Tabs>
      <div
        className="flex items-center justify-between p-3"
        style={{ flexShrink: 0 }} // Prevent this section from shrinking
      >
        {isMobile ? (
          <IconButton onClick={() => navigate("/dashboard/mycourses/create")}>
            <AddIcon sx={{ color: "#2d9cdb" }} />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/mycourses/create")}
          >
            Create New Course
          </Button>
        )}

        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="list" aria-label="list">
            <ViewHeadlineIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid">
            <GridViewIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {/* 2. This wrapper will grow to fill remaining space */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 300, // Adjust as needed for your area
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          // 3. The Grid will fill its parent and handle internal scrolling
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            alignItems="flex-start" // Align items to the top
            sx={{
              padding: "12px",
            }}
          >
            {paginatedData?.map((course) => (
              <Grid
                item
                key={course?.id}
                sx={{
                  // Removed explicit width to let MUI Grid columns handle it
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
width: alignment === "list" ? "100%" : "fit-content",
                }}
                xs={alignment === "grid" ? 12 : 12}
                sm={alignment === "grid" ? 6 : 12}
                md={alignment === "grid" ? 4 : 12}
                lg={alignment === "grid" ? 3 : 12}
              >
                <CourseCard
                  id={course?.id}
                  alignment={alignment}
                  page="mycourses"
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      {pageCount > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
}
