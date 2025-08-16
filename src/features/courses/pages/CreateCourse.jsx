import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import BasicInfoForm from "../components/BasicInfoForm";
import { supabase } from "../../../utils/supabase";
import { useParams } from "react-router";

import PreviewCourse from "../components/PreviewCourse";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import AlertModal from "../../../components/common/AlertModal";

export default function CreateCourse() {
  const ContentContainer = lazy(() => import("../components/ContentContainer"));
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [breadcrumbsTitle, setBreadcrumbsTitle] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [alertModal, setAlertModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const isInitialLoad = useRef(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  async function changeCourseStatus() {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("courses")
        .update({ published: false })
        .eq("id", courseId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        dispatch(
          showSnackbar({
            message: "Your course status has been changed",
            severity: "success",
          })
        );
        setAlertModal(false);
        setCourseData((pervState) => {
          return { ...pervState, published: false };
        });
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  }
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
        if (data?.published) {
          setAlertModal(true);
        }
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
  useEffect(() => {
    if (courseData?.id && user.id !== courseData?.instructor_id|| user?.role !== 'instructor') {
    throw new Response(null, {
      status: 401,
      statusText: "You are not authorized to enter this page.",
    });
    }
  }, [courseId, courseData?.instructor_id, user, courseData?.id]);
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
        sx={{ flexShrink: 0, mt: 2 }}
      >
        <Tab label="1. Basic Info" />
        <Tab label="2. content" disabled={!courseId} />
        <Tab label="3. Preview" disabled={!courseId} />
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
      {alertModal && (
        <AlertModal
          title={`This course is currently published!!`}
          open={alertModal}
          setOpen={setAlertModal}
          action={changeCourseStatus}
        >
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              This course is currently published and visible to students. If you
              want to make changes, you can unpublish it to hide it from
              students.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Button onClick={() => setAlertModal(false)}>Disagree</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={changeCourseStatus}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Agree
            </Button>
          </DialogActions>
        </AlertModal>
      )}
    </div>
  );
}
