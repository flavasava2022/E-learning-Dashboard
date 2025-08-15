import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Rating,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSearchParams } from "react-router";
export default function ReviewFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("rating") || 0);

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
        <Typography component="span">Rating</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (newValue) {
              setSearchParams((current) => {
                const params = new URLSearchParams(current);
                params.set("rating", newValue);
                return params;
              });
            } else {
              setSearchParams((current) => {
                const params = new URLSearchParams(current);
                params.delete("rating");
                return params;
              });
            }
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
}
