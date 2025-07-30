import CourseCard from "../../../ui/components/CourseCard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Pagination from "@mui/material/Pagination"; // Add this
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import Filters from "../../../ui/components/MobileFilters";
import { useSearchParams } from "react-router";
import { useFetch } from "../../../hooks/useFetch";
import { useState } from "react";
import DesktopFilters from "../../../ui/components/DesktopFilters";
import { useMediaQuery } from "react-responsive";
import SearchBtn from "../../../ui/components/SearchBtn";

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openFilters, setOpenFilters] = useState(false);
  const [alignment, setAlignment] = useState("grid");
  const [search, setSearch] = useState(" ");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const { loading, data, error } = useFetch();

  const totalCourses = data.length;
  const pageCount = Math.ceil(totalCourses / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="flex  justify-between gap-4 w-full h-full">
      {isMobile ? (
        <Filters openFilters={openFilters} setOpenFilters={setOpenFilters} />
      ) : (
        <DesktopFilters />
      )}
      <div className="flex flex-col items-center justify-between flex-grow gap-2 h-full">
        <Box className="sticky flex items-center justify-between w-full gap-2">
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            edge="start"
            color="primary"
            aria-label="open filter drawer"
            onClick={() => setOpenFilters(true)}
          >
            <FilterAltIcon />
          </IconButton>
          <SearchBtn setPage={setPage} />
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
        </Box>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            overflowY: "auto",
            height: "100%",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          {loading ? (
            <Grid item xs={12} display="flex" justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            paginatedData.map((course) => (
              <Grid
                item
                key={course.id}
                sx={{
                  width: alignment === "list" ? "98%" : "fit-content",
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                }}
                xs={12}
                sm={alignment === "grid" ? 6 : 12}
                md={alignment === "grid" ? 4 : 12}
                lg={alignment === "grid" ? 3 : 12}
              >
                <CourseCard id={course.id} alignment={alignment} />
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination goes below courses */}
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        )}
      </div>
    </div>
  );
}
