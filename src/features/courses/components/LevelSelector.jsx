// In LevelSelector.jsx

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form"; // <-- IMPORT Controller

// Accept `control` as a prop instead of `register`
export default function LevelSelector({ control, errors }) {
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
      <Typography variant="body" sx={{ fontWeight: "700", color: "#333" }}>
        Course Level
      </Typography>

      {/*
        WRAP YOUR ENTIRE FORM CONTROL IN THE <Controller> COMPONENT
      */}
      <Controller
        name="course_level"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.course_level} required>
            <InputLabel id="course-level-label">Level</InputLabel>
            <Select
              labelId="course-level-label"
              label="Level"
              {...field} // <-- Spread the `field` object here. It contains the correct value, onChange, etc.
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
            {errors.course_level && (
              <Typography variant="caption" color="error">
                {errors.course_level.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
}
