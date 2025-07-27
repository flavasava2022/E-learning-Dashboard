import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

export default function PublicRoute({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) return <div>Loading...</div>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
