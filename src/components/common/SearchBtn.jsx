import { IconButton, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router";
export default function SearchBtn({ setPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(" ");
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
    setPage(1); // Reset to the first page on new search
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  return (
    <OutlinedInput
      id="outlined-adornment-weight"
      fullWidth
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleKeyPress}
      sx={{
        width: "350px",
        height:'54px'
      }}
      endAdornment={
        <IconButton
          size="small"
          color="primary"
          aria-label="search"
          onClick={handleSearchSubmit}
        >
          {" "}
          <SearchIcon />
        </IconButton>
      }
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
    />
  );
}
