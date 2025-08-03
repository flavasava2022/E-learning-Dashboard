import { useState } from "react";
import { Controller } from "react-hook-form";
import { Avatar, Box, ButtonBase, InputLabel, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export default function ImageUploader({ name, control, errors }) {
  // This state is now local to the uploader component
  const [previewSrc, setPreviewSrc] = useState(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <InputLabel sx={{ fontWeight: "700", color: "#333" }}>
        Cover Image
      </InputLabel>

      <Controller
      
        name={name}
        control={control}
        defaultValue={null}
        render={({ field: { onChange, value, ...field } }) => {
          const handleFileChange = (event) => {
            const file = event.target.files?.[0];
            if (file) {
              // Update react-hook-form's state with the File object
              onChange(file);

              // Update the local state to show a preview
              const reader = new FileReader();
              reader.onload = () => setPreviewSrc(reader.result);
              reader.readAsDataURL(file);
            }
          };

          return (
            <>
              <ButtonBase
                component="label"
                htmlFor="cover-upload"
                sx={{
                  width: "100%",
                  height: "350px",
                  borderRadius: 3,
                  p: 1,
                  border: `2px dashed ${errors[name] ? '#d32f2f' : '#d1d5dd'}`,
                }}
              >
                {previewSrc ? (
                  <Avatar
                    alt="Cover preview"
                    src={previewSrc}
                    sx={{ width: "100%", height: "100%", borderRadius: 2, objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 1,
                      backgroundColor: "primary.light",
                      borderRadius: 2,
                      color: "primary.contrastText",
                      transition:'all 0.3s ease',
                      '&:hover': { backgroundColor: 'primary.main' }
                    }}
                  >
                    <UploadIcon />
                    <Typography variant="body2">Click to upload</Typography>
                    <Typography variant="caption">SVG, PNG, JPG</Typography>
                  </Box>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  {...field} // Pass the rest of the field props
                  value={value?.fileName} // Needed to clear the input
                  onChange={handleFileChange}
                  required
                />
              </ButtonBase>
              {errors[name] && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors[name].message}
                </Typography>
              )}
            </>
          );
        }}
      />
    </Box>
  );
}