import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSearchParams } from "react-router";
function valuetext(value) {
  return `${value}°C`;
}
export default function RangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    const prices = searchParams.getAll("price").map(Number);
    return prices.length === 2 ? prices : [0, 3000];
  });
  const MAX = 3000;
  const MIN = 0;
  const marks = [
    {
      value: MIN,
      label: "",
    },
    {
      value: MAX,
      label: "",
    },
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      params.delete("price");
      newValue.forEach((price) => {
        params.append("price", price);
      });
      return params;
    });
  };

  return (
    <Accordion
      sx={{
        width: "100%",
        border: 0,
        borderRadius: 0,
        boxShadow: 0,
        "&:before": { backgroundColor: "transparent" },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography component="span">Price Range</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Slider
            getAriaLabel={() => "Price Range range"}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            disableSwap
            marks={marks}
            min={MIN}
            max={MAX}
            size="small"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">{MIN} $</Typography>
            <Typography variant="body2">{MAX} $</Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
