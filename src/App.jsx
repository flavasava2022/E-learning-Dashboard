import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";

import { SidebarProvider } from "./context/SidebarContext";
import GlobalSnackbar from "./ui/components/GlobalSnackbar";
import Home from "./pages/Dashboard/Home/Home";
import DashboardLayout from "./ui/layouts/protected/DashboardLayout";
import Auth from "./pages/Auth/Auth";
import PublicRoute from "./ui/layouts/global/PublicRoute";
import ProtectedRoute from "./ui/layouts/protected/ProtectedRoute";
import Courses from "./pages/Dashboard/Courses/Courses";
import SettingsLayout from "./ui/layouts/protected/SettingsLayout";
import MyDetails from "./pages/Dashboard/Settings/MyDetails";
import Password from "./pages/Dashboard/Settings/Password";
import Profile from "./pages/Dashboard/Settings/Profile";
import Notification from "./pages/Dashboard/Settings/Notification";
import CourseDetails from "./pages/Dashboard/CourseDetails";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute>
          <Auth />
        </PublicRoute>
      ),
    },
    // Protected routes
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["student", "instructor"]}>
          <SidebarProvider>
            <DashboardLayout />
          </SidebarProvider>
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "courses", element: <Courses /> },
        { path: "courses/:slug", element: <CourseDetails /> },
        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <MyDetails /> },
            { path: "profile", element: <Profile /> },
            { path: "password", element: <Password /> },
            { path: "notification", element: <Notification /> },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={route} /> <GlobalSnackbar />
    </>
  );
}

export default App;
