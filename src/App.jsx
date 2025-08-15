import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";

import { SidebarProvider } from "./context/SidebarContext";
import GlobalSnackbar from "./components/common/GlobalSnackbar";
import PublicRoute from "./components/layouts/global/PublicRoute";
import ProtectedRoute from "./components/layouts/protected/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import { Box, CircularProgress } from "@mui/material";

const Auth = lazy(() => import("./features/auth/Auth.jsx"));
const DashboardLayout = lazy(
  () => import("./components/layouts/protected/DashboardLayout")
);
const Home = lazy(() => import("./features/dashboard/pages/Home.jsx"));
const Courses = lazy(() => import("./features/courses/pages/CoursesListPage.jsx"));
const CourseDetails = lazy(() => import("./features/courses/pages/CourseDetails.jsx"));
const MyCourses = lazy(() => import("./features/courses/pages/MyCourses.jsx"));
const CoursePage = lazy(() => import("./features/courses/pages/CoursePage.jsx"));
const CreateCourse = lazy(() => import("./features/courses/pages/CreateCourse.jsx"));
const SettingsLayout = lazy(
  () => import("./components/layouts/protected/SettingsLayout")
);
const MyDetails = lazy(() => import("./features/settings/pages/MyDetails.jsx"));
const Profile = lazy(() => import("./features/settings/pages/Profile"));
const Password = lazy(() => import("./features/settings/pages/Password"));
const Notification = lazy(
  () => import("./features/settings/pages/Notification")
);

const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: 300, // Adjust as needed for your area
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={90}/>
            </Box>
          }
        >
          <Auth />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute allowedRoles={["student", "instructor"]}>
        <SidebarProvider>
          <Suspense
            fallback={
              <Box
                sx={{
                  minHeight: 300, // Adjust as needed for your area
                  width: "100%",
                  display: "flex",
                                  height: "100vh",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={90}/>
              </Box>
            }
          >
            <DashboardLayout />
          </Suspense>
        </SidebarProvider>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "courses", element: <Courses /> },
      { path: "courses/:slug", element: <CourseDetails /> },
      { path: "mycourses", element: <MyCourses /> },
      { path: "course/:courseId/learn", element: <CoursePage /> },
      { path: "mycourses/create/:courseId?", element: <CreateCourse /> },
      {
        path: "settings",
        element: (
          <Suspense
            fallback={
              <Box
                sx={{
                  minHeight: 300, // Adjust as needed for your area
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                                  height: "100vh",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={90}/>
              </Box>
            }
          >
            <SettingsLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <MyDetails /> },
          { path: "profile", element: <Profile /> },
          { path: "password", element: <Password /> },
          { path: "notification", element: <Notification /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />, // or a 404 component page
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={route} />
      <GlobalSnackbar />
    </>
  );
}

export default App;
