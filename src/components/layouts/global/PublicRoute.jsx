import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

export default function PublicRoute({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized)
    return (
      <Box
        sx={{
          minHeight: 300, // Adjust as needed for your area
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
