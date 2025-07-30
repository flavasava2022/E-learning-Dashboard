import { Box, Typography } from "@mui/material";
import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CategoriesFilter from "./CategoriesFilter";
import InstructorsFilter from "./InstructorsFilter";
import RangeFilter from "./RangeFilter";
import ReviewFilter from "./ReviewFilter";
export default function DesktopFilters() {
  return (
    <Box className="flex flex-col items-start gap-2 min-w-[270px] max-w-[40%] p-4 border-r border-gray-200">
      <div className="flex items-center gap-2">
        <FilterAltIcon />
        <Typography variant="subtitle1" component="div">
          Filters
        </Typography>
      </div>
      <CategoriesFilter />
      <InstructorsFilter />
      <RangeFilter />
      <ReviewFilter />
    </Box>
  );
}
