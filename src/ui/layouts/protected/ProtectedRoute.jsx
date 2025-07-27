import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
