import { Box, InputLabel, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export default function DescriptionInput({ control, errors }) {
  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => {
        const descriptionLength = field.value?.length || 0;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <InputLabel
              htmlFor="description-input"
              sx={{ fontWeight: "700", color: "#333" }}
            >
              Description
            </InputLabel>

            <TextField
              id="description-input"
              multiline
              rows={5}
              placeholder="Type your Description Here..."
              error={!!errors.description}
              helperText={errors.description?.message}
              {...field}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ alignSelf: "flex-end" }}
            >
              {500 - descriptionLength} characters left
            </Typography>
          </Box>
        );
      }}
    />
  );
}
