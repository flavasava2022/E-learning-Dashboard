import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useSearchParams } from "react-router";

export default function InstructorsFilter() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (event) => {
    const newValues = {
      ...checked,
      [event.target.name]: event.target.checked,
    };
    const instructor = Object.keys(newValues).filter(
      (key) => newValues[key] === true
    );
    if (instructor.length > 0) {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("instructor"); // Remove previous values

        // Add each category as its own query param
        instructor.forEach((instructor) => {
          params.append("instructor", instructor);
        });
        return params;
      });
    } else {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("instructor");
        return params;
      });
    }
    setChecked(newValues);
  };
  useEffect(() => {
    const fetchInstructorsName = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")

          .select("*")
          .eq("published", "true");

        if (error) throw error;
        if (data) {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchInstructorsName();
  }, [searchParams]);
  useEffect(() => {
    const checkedValues = searchParams.getAll("instructor");
    const checkBoxes = {};
    items.forEach(
      (item) =>
        (checkBoxes[item.instructor_name] = checkedValues.includes(
          item.instructor_name
        ))
    );
    setChecked(checkBoxes);
  }, [items, searchParams]);
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography component="span">instructors</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {items.map((item) => (
            <FormControlLabel
              key={item?.id}
              control={
                <Checkbox
                  checked={!!checked[item.instructor_name]}
                  onChange={handleChange}
                  name={item.instructor_name}
                />
              }
              label={item.instructor_name}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
