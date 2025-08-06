import { Box, Rating, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export default function RatingInput({ control, name, errors }) {
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
        Rating
      </Typography>
      <Controller
        name={name}
        control={control}
        defaultValue={1}
        render={({ field }) => (
          <Rating
            {...field}
            value={Number(field.value)} // Ensure value is a number
            size="large"
            onChange={(event, newValue) => {
              field.onChange(newValue); // Pass the new value to the form state
            }}
          />
        )}
      />
      {errors[name] && (
        <Typography variant="caption" color="error">
          {errors[name]?.message}
        </Typography>
      )}
    </Box>
  );
}
