import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router";
import { supabase } from "../../utils/supabase";

export default function CategoriesFilter() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event) => {
    const newValues = {
      ...checked,
      [event.target.name]: event.target.checked,
    };
    const categories = Object.keys(newValues).filter(
      (key) => newValues[key] === true
    );
    if (categories.length > 0) {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("categories"); // Remove previous values

        // Add each category as its own query param
        categories.forEach((category) => {
          params.append("categories", category);
        });
        return params;
      });
    } else {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("categories");
        return params;
      });
    }
    setChecked(newValues);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name,category_id");

        if (error) throw error;
        if (data) {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const checkedValues = searchParams.getAll("categories");
    const checkBoxes = {};
    items.forEach(
      (item) =>
        (checkBoxes[item.category_id] = checkedValues.includes(
          item.category_id
        ))
    );
    setChecked(checkBoxes);
  }, [items, searchParams]);

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
        <Typography component="span">Categories</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {items.map((item) => (
            <FormControlLabel
              key={item.name}
              control={
                <Checkbox
                  checked={!!checked[item.category_id]}
                  onChange={handleChange}
                  name={item.category_id}
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
