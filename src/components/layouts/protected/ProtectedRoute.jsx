import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized)
    return (
      <Box
        sx={{
          minHeight: 300, // Adjust as needed for your area
          width: "100%",
          height:'100vh',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={90} />
      </Box>
    );

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
