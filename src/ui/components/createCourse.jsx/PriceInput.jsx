import {
  Box,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function PriceInput({ control, errors }) {
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
        Pricing
      </Typography>

      <Controller
        name="price"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Amount"
            type="number"
            fullWidth
            error={!!error}
            helperText={error?.message}
            // 2. Pass adornments via the InputProps prop
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">USD</InputAdornment>,
            }}
          />
        )}
      />
    </Box>
  );
}
