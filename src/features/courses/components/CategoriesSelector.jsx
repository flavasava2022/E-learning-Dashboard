import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Controller } from "react-hook-form";
export default function CategoriesSelector({ control, errors }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("category_id,name");

      if (error) {
        console.error(error);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",
        gap: 2,
      }}
      className="rounded-xl shadow p-3 bg-white"
    >
      {loading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="body" sx={{ fontWeight: "700", color: "#333" }}>
            Categories
          </Typography>

          {categories?.length && (
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category_id} required>
                  <InputLabel id="category-id-label">category</InputLabel>
                  <Select
                    labelId="category-id-label"
                    label="category"
                    {...field} // <-- Spread the `field` object here. It contains the correct value, onChange, etc.
                  >
                    {categories?.map((category) => (
                      <MenuItem
                        value={category?.category_id}
                        key={category?.category_id}
                      >
                        {category?.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category_id && (
                    <Typography variant="caption" color="error">
                      {errors.category_id.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          )}
        </>
      )}
    </Box>
  );
}
