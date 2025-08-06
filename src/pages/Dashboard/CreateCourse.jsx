import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import BasicInfoForm from "../../ui/components/createCourse.jsx/BasicInfoForm";
import { supabase } from "../../utils/supabase";
import { useParams } from "react-router";
import ContentContainer from "../../ui/components/createCourse.jsx/ContentContainer";
import PreviewCourse from "../../ui/components/createCourse.jsx/PreviewCourse";
import { showSnackbar } from "../../store/snackbarSlice";
import { useDispatch } from "react-redux";

export default function CreateCourse() {
  const ContentContainer = lazy(
    () => import("../../ui/components/createCourse.jsx/ContentContainer")
  );
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [breadcrumbsTitle, setBreadcrumbsTitle] = useState("");
  const [courseData, setCourseData] = useState(null);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const isInitialLoad = useRef(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select(
            `
              *,
              modules (
                *,
                lessons (*)
              )
            `
          )
          .eq("id", courseId)
          .single();

        if (error) throw error;

        setCourseData(data);

        if (isInitialLoad.current) {
          setValue(data?.edit_course_step || 0);
          isInitialLoad.current = false;
        }
      } catch (error) {
        dispatch(showSnackbar({ message: error.message, severity: "error" }));
      } finally {
        setLoading(false); // This will run regardless of success or failure
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, dispatch]);
  useEffect(() => {
    if (courseData) {
      setBreadcrumbsTitle(courseData?.title);
    }
  }, [courseData, value]);
  return (
    <div
      className="w-full"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        gap: 3,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          DASHBOARD
        </Link>
        <Link underline="hover" color="inherit" href="/dashboard/mycourses">
          My COURSES
        </Link>
        <Typography sx={{ color: "text.primary" }}>
          {breadcrumbsTitle || "CREATE COURSE"}
        </Typography>
      </Breadcrumbs>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={{ flexShrink: 0,mt:2 }}
      >
        <Tab label="1. Basic Info" />
        <Tab label="2. content" />
        <Tab label="3. Preview" />
      </Tabs>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "5px",
          marginTop: "10px",
        }}
      >
        {loading ? (
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
        ) : (
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <>
              {value === 0 && (
                <BasicInfoForm
                  onTitleChange={setBreadcrumbsTitle}
                  courseData={courseData}
                  setValue={setValue}
                  setCourseData={setCourseData}
                  setBreadcrumbsTitle={setBreadcrumbsTitle}
                />
              )}
              {value === 1 && (
                <ContentContainer courseData={courseData} setValue={setValue} />
              )}
              {value === 2 && (
                <PreviewCourse courseData={courseData} setValue={setValue} />
              )}
            </>
          </Suspense>
        )}
      </div>
    </div>
  );
}
