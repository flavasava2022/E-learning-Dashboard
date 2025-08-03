import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  FormHelperText,
  Typography,
} from "@mui/material";

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

function getStyles(name, selectedItems, theme) {
  return {
    fontWeight: selectedItems.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
const courseTags = [
  "Programming",
  "Design",
  "Marketing",
  "Business",
  "Data Science",
  "Self-Development",
  "Music",
  "Photography",
];
// 1. Accept `control`, `name`, `label`, and `options` as props.
export default function TagsSelector({ control, errors }) {
  const theme = useTheme();

  return (
    // 2. Wrap the component in the Controller
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        gap: 2,
      }}
      className="rounded-xl shadow p-3 bg-white"
    >
      <Typography variant="body" sx={{ fontWeight: "700", color: "#333" }}>
        Tags
      </Typography>

      <Controller
        name="tags"
        control={control}
        defaultValue={[]} // Important: Default value for multi-select must be an array
        render={({ field }) => (
          <FormControl fullWidth error={!!errors?.tags}>
            <InputLabel id={`tags-label`}>Tags</InputLabel>
            <Select
              labelId={`tags-label`}
              id="tags"
              multiple
              value={field.value}
              onChange={field.onChange}
              input={<OutlinedInput id={`select-tags`} label="tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {/* 4. Map over the `options` prop */}
              {courseTags.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  style={getStyles(option, field.value, theme)}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors?.tags && (
              <FormHelperText>{errors?.tags?.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
}
