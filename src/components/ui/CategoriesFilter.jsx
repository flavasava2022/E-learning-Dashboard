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

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CategoriesFilter() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setPersonName(typeof value === "string" ? value.split(",") : value);

    // Update URL search params with selected categories (IDs)
    if (value.length > 0) {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("categories"); // Remove previous values
        // Add each selected category ID as individual query param
        value.forEach((categoryId) => {
          params.append("categories", categoryId);
        });
        return params;
      });
    } else {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        params.delete("categories"); // Clear categories param if none selected
        return params;
      });
    }
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
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Initialize checked state from URL search params
    const checkedValues = searchParams.getAll("categories");
    const checkBoxes = {};
    items.forEach(
      (item) =>
        (checkBoxes[item.category_id] = checkedValues.includes(
          item.category_id
        ))
    );
    setChecked(checkBoxes);
    // Set personName state from URL params for controlled Select
    setPersonName(checkedValues);
  }, [items, searchParams]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">categories</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName} // Array of selected category_ids
          onChange={handleChange}
          input={<OutlinedInput label="categories" />}
          renderValue={(selected) => {
            return selected
              .map(
                (id) =>
                  items.find((item) => item.category_id === id)?.name || id
              )
              .join(", ");
          }}
          MenuProps={MenuProps}
          name="categories"
        >
          {items?.map((item) => (
            <MenuItem key={item.category_id} value={item.category_id}>
              <Checkbox checked={personName.includes(item.category_id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
