import { Box, Typography, Divider } from "@mui/material";
import React from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CategoriesFilter from "./CategoriesFilter";
import InstructorsFilter from "./InstructorsFilter";
import RangeFilter from "./RangeFilter";
import ReviewFilter from "./ReviewFilter";

export default function DesktopFilters() {
  return (
    <Box
      className="flex flex-col min-w-[270px] max-w-[320px] border-r border-gray-200 bg-white h-full overflow-auto "
      sx={{

        overflowY: "auto",
        p: 2,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "3px",
        },
      }}
    >
      {/* Header */}
      <Box className="flex items-center gap-2 mb-3">
        <FilterAltIcon color="primary" />
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: "1.1rem" }}
        >
          Filters
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Filters List */}
      <CategoriesFilter />
      <Divider sx={{ my: 1 }} />
      <InstructorsFilter />

      <Divider sx={{ my: 1 }} />
      <ReviewFilter />
    </Box>
  );
}
