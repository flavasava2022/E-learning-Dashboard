import { useRouteError, Navigate } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  if (error.status === 401) {
    return <Navigate to="/" replace />;
  }
  // Handle other errors or display a generic error message
  return <div>Something went wrong</div>;
}
