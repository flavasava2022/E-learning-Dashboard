import { Box, Typography } from "@mui/material";

export default function Notification() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        minHeight: "100%",
        p: 2,

        alignItems: "center",
      }}
      className="rounded-xl shadow p-1 bg-white"
    >
      <Typography variant="h1" color="text.secondary">
        soon
      </Typography>
    </Box>
  );
}
