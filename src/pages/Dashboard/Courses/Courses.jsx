import CourseCard from "../../../ui/components/CourseCard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  CircularProgress,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import GridViewIcon from "@mui/icons-material/GridView";

import SearchIcon from "@mui/icons-material/Search";
import Filters from "./Filters";
import { useSearchParams } from "react-router";
import CategoriesFilter from "./CategoriesFilter";
import { useFetch } from "../../../hooks/useFetch";
import { useState } from "react";
export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [openFilters, setOpenFilters] = useState(false);
  const [alignment, setAlignment] = useState("grid");
  const [search, setSearch] = useState(" ");
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSearchSubmit = () => {
    if (!search.trim()) {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("search");
        return params;
      });
    } else {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.set("search", search);
        return params;
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const { loading, data, error } = useFetch();

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <div className=" sticky flex items-center justify-between w-full gap-2">
        <IconButton
          edge="start"
          color="primary"
          aria-label="open filter drawer"
          onClick={() => setOpenFilters(true)}
        >
          {" "}
          <FilterAltIcon />
        </IconButton>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          // 1. Update state on every keystroke
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress} // Optional: for "Enter" key submission
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchSubmit}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          fullWidth
        />
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="row" aria-label="row">
            <ViewHeadlineIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid">
            <GridViewIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="flex items-center justify-between flex-wrap  gap-2 overflow-auto">
        {loading ? (
          <CircularProgress />
        ) : (
          data?.map((course) => <CourseCard course={course} key={course?.id} />)
        )}
      </div>
      <Filters openFilters={openFilters} setOpenFilters={setOpenFilters} />
    </div>
  );
}
