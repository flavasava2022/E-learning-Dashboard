import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router";
import { supabase } from "../../utils/supabase";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function InstructorsFilter() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [personName, setPersonName] = useState([]);
  const handleChange = (event) => {
    const { value } = event.target;
    setPersonName(typeof value === "string" ? value.split(",") : value);


    if (value.length > 0) {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("instructor");

        value.forEach((instructorId) => {
          params.append("instructor", instructorId);
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
  };
  useEffect(() => {
    const fetchInstructorsName = async () => {
      try {
        const { data, error } = await supabase
          .from("users")

          .select("id,first_name,last_name")
          .eq("role", "instructor");

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
    // Initialize checked state from URL search params
    const checkedValues = searchParams.getAll("instructor");
    const checkBoxes = {};
    items.forEach(
      (item) => (checkBoxes[item.id] = checkedValues.includes(item.id))
    );
    setChecked(checkBoxes);
    // Set personName state from URL params for controlled Select
    setPersonName(checkedValues);
  }, [items, searchParams]);
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Instructors</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName} // Array of selected category_ids
          onChange={handleChange}
          input={<OutlinedInput label="Instructors" />}
          renderValue={(selected) =>
            selected
              .map((instructorId) => items.find((item) => item.id === instructorId)?.first_name || instructorId)
              .join(", ")
          }
          MenuProps={MenuProps}
          name="categories"
        >
          {items?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={personName.includes(item.id)} />
              <ListItemText primary={`${item?.first_name} ${item?.last_name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
