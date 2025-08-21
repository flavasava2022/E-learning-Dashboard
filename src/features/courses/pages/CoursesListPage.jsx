import CourseCard from "../../../components/common/CourseCard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GridViewIcon from "@mui/icons-material/GridView";

import Filters from "../../../components/ui/MobileFilters";
import { useFetch } from "../../../hooks/useFetch";
import { useState } from "react";
import DesktopFilters from "../../../components/ui/DesktopFilters";
import { useMediaQuery } from "react-responsive";
import SearchBtn from "../../../components/common/SearchBtn";
import CategoriesSelector from "../components/CategoriesSelector";
import CategoriesFilter from "../../../components/ui/CategoriesFilter";
import InstructorsFilter from "../../../components/ui/InstructorsFilter";

export default function CoursesListPage() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openFilters, setOpenFilters] = useState(false);
  const [alignment, setAlignment] = useState("grid");

  const [page, setPage] = useState(1);
  const pageSize = 10;

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
      ) : null}
      <div className="flex flex-col items-center    gap-2 h-full w-full">
        <Box className="sticky flex items-center justify-between w-full gap-2">
          <Box sx={{ display: "flex", gap: 2,justifyContent:'center',alignItems:'center' }}>
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
            {!isMobile && (
              <>
                <CategoriesFilter />
                <InstructorsFilter />
              </>
            )}
          </Box>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton
              value="list"
              aria-label="list"
              disabled={alignment === "list"}
            >
              <ViewHeadlineIcon />
            </ToggleButton>
            <ToggleButton
              value="grid"
              aria-label="grid"
              disabled={alignment === "grid"}
            >
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            overflowY: "auto",
            height: "100%",
            paddingTop: "8px",
            paddingBottom: "8px",
            width: "100%",
          }}
        >
          {loading ? (
            <Grid
              

              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%", height: "100%" }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            paginatedData.map((course) => (
              <Grid
                
                key={course.id}
                sx={{
                  width: alignment === "list" ? "98%" : "fit-content",
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  height: "fit-content",
                }}


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
