import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import AlertModal from "../../../components/common/AlertModal";
import VideoPlayer from "../../../components/common/VideoPlayer";
import { useParams, useSearchParams } from "react-router";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../utils/supabase";
import { showSnackbar } from "../../../store/snackbarSlice";
import { findLessonById, getNextLesson } from "../../../utils/learn";
import useCourseData from "../hooks/useCourseData";

export default function CoursePage() {
  const { courseId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [congratsModal, setCongratsModal] = useState(false);
  const [lastLesson, setLastLesson] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const initialLoad = useRef(true);

  const {
    data,
    progressSet,
    totalLessons,
    completedPercent,
    loadingIds,
    handleCheckbox,
    loading,
    enrolled,
    setEnrolled,
    setData,
  } = useCourseData({ courseId, user });
  // Select lesson on first load
  console.log(data);
  const TotalHours =
    data?.modules
      ?.flatMap((module) => module.lessons)
      ?.reduce((sum, lesson) => sum + (lesson?.duration_minutes || 0), 0) / 60;
  useEffect(() => {
    if (!data?.modules) return;
    if (!initialLoad.current) return;

    let lesson = null;
    const paramLessonId = searchParams.get("lesson");
    if (paramLessonId) {
      lesson = findLessonById(data, paramLessonId);
    } else if (data?.progress?.length > 0) {
      const lastCompleted = data.progress[data.progress.length - 1]?.lesson_id;
      const lessonData = findLessonById(data, lastCompleted);
      lesson = getNextLesson(data, lessonData);
    } else {
      const firstModule = data?.modules[0];
      lesson = firstModule?.lessons?.[0] || null;
    }

    if (lesson) {
      setSearchParams((params) => {
        const copy = new URLSearchParams(params);
        copy.set("lesson", lesson.id);
        return copy;
      });
      setExpanded(`panel-${lesson.module_id}`);
      setLastLesson(lesson);
    }
    initialLoad.current = false;
  }, [data, searchParams, setSearchParams]);

  // Show congrats modal when completed
  useEffect(() => {
    if (
      enrolled?.completed_status === "ongoing" &&
      data?.progress?.length === totalLessons &&
      totalLessons > 0
    ) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("enrollments")
            .update({ completed_status: "completed" })
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .select()
            .single();
          if (error) throw error;

          if (data) {
            setCongratsModal(true);
            setEnrolled(data);
          }
        } catch (error) {
          dispatch(showSnackbar({ message: error.message, severity: "error" }));
        }
      })();
    }
  }, [data, totalLessons, courseId, dispatch, user.id, setEnrolled, enrolled]);
  if (!loading && !enrolled) {
    throw new Response(null, {
      status: 401,
      statusText: "User not Enrolled in this course",
    });
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        height: "100%",
        boxSizing: "border-box",

        padding: "1px",
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
        <>
          {/* Main Video Panel */}
          <Box
            className="rounded-xl shadow bg-white"
            sx={{
              flex: { xs: "1 1 auto", md: "3 2" },
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              overflow: { xs: "none", sm: "auto" },
            }}
          >
            <VideoPlayer
              courseId={courseId}
              setLastLesson={setLastLesson}
              course={data}
              lastLesson={lastLesson}
              setExpanded={setExpanded}
              progressSet={progressSet}
              setData={setData}
            />

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                gap: "20px",
                width: "100%",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {data?.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  minWidth: 0,
                }}
              >
                {data?.description}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={data.users?.avatar_url}
                    sx={{ borderRadius: "8px", width: 60, height: 60 }}
                    alt={`${data?.users?.first_name} ${data?.users?.last_name}`}
                  />
                  <Typography variant="body2" sx={{ color: "#2d9cdb" }}>
                    {`${data?.users?.first_name} ${data?.users?.last_name}`}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTimeIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.primary">
                    {TotalHours.toFixed(2)} Hours
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                  <Typography variant="body2" color="text.secondary">
                    {data.rating ?? "N/A"}
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ width: "100%" }} />
            </Box>
            <Box
              sx={{
                width: "100%",
                padding: 2,

                flexDirection: "column",
                display: { xs: "none", sm: "flex" },
                boxShadow: 0,
                gap: 2,
                borderRadius: "8px",
              }}
              className="border-1 border-gray-300"
            >
              <Typography gutterBottom variant="h5" component="div">
                Course Features
              </Typography>
              <Stack direction="column" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SchoolOutlinedIcon color="primary" />
                  <Typography variant="body2" color="text.primary">
                    {data?.modules?.length ?? 0} Sections
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <OndemandVideoOutlinedIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.primary">
                    {totalLessons} Lectures
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTimeIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.primary">
                    {TotalHours.toFixed(2)} Hours
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StarIcon fontSize="small" sx={{ color: "#ffb400" }} />
                  <Typography variant="body2" color="text.secondary">
                    {data.rating ?? "N/A"} Rating
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box
            className="rounded-xl shadow bg-white"
            sx={{
              flex: { xs: "1 1 auto", md: "2 3" },
              display: "flex",
              flexDirection: "column",
              p: 2,
              overflowY: "auto",
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                {completedPercent?.toFixed(0)}% Complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completedPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  my: 1,
                  [`& .MuiLinearProgress-bar`]: {
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="subtitle1" fontWeight={500}>
                Last activity:&nbsp;
                {data?.progress?.length
                  ? dayjs(
                      data?.progress[data?.progress.length - 1]?.completed_at
                    ).format("MMM D, YYYY")
                  : dayjs(new Date()).format("MMM D, YYYY")}
              </Typography>
            </Box>

            {!enrolled ? (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                You're not enrolled in this course.
              </Typography>
            ) : (
              (data?.modules || []).map((module) => {
                const completedInModule = module.lessons.filter((l) =>
                  progressSet.has(l.id)
                ).length;

                return (
                  <Accordion
                    key={module.id}
                    elevation={0}
                    expanded={expanded === `panel-${module.id}`}
                    onChange={() =>
                      setExpanded(
                        expanded === `panel-${module.id}`
                          ? null
                          : `panel-${module.id}`
                      )
                    }
                    disableGutters
                    sx={{
                      width: "100%",
                      mb: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${module.id}-content`}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ flexGrow: 1 }}
                      >
                        <SchoolOutlinedIcon
                          color="primary"
                          sx={{ display: { xs: "none", sm: "block" } }}
                        />
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          sx={{
                            color:
                              expanded === `panel-${module.id}`
                                ? "primary.main"
                                : "text.primary",
                          }}
                        >
                          {module.title}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                          {completedInModule}/{module.lessons.length}
                        </Typography>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "10px 12px",
                        alignItems: "center",
                      }}
                    >
                      {module.lessons && module.lessons.length > 0 ? (
                        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                          {module.lessons.map((lesson) => {
                            const isActive =
                              searchParams.get("lesson") === lesson.id;
                            return (
                              <Paper
                                key={lesson.id}
                                sx={{
                                  border: 0,
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  px: 1.5,
                                  py: 0.5,
                                  backgroundColor: isActive
                                    ? "primary.lighter"
                                    : "background.default",
                                  borderLeft: isActive
                                    ? "4px solid #2d9cdb"
                                    : "4px solid transparent",
                                  transition:
                                    "background-color 0.2s, border-left-color 0.2s",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                  sx={{ flexGrow: 1 }}
                                >
                                  <Checkbox
                                    id={lesson.id}
                                    checked={progressSet.has(lesson.id)}
                                    onChange={(e) => handleCheckbox(e, lesson)}
                                    disabled={
                                      enrolled?.completed_status ===
                                        "completed" || !!loadingIds[lesson.id]
                                    }
                                  />
                                  <Tooltip title={lesson.title}>
                                    <Typography
                                      noWrap
                                      sx={{
                                        fontWeight: 500,
                                        flex: 1,
                                        cursor: "pointer",
                                        color: isActive
                                          ? "primary.main"
                                          : "text.primary",
                                      }}
                                      variant="body2"
                                      onClick={() => {
                                        setSearchParams((params) => {
                                          const copy = new URLSearchParams(
                                            params
                                          );
                                          copy.set("lesson", lesson.id);
                                          return copy;
                                        });
                                        setLastLesson(lesson);
                                      }}
                                    >
                                      {lesson.title}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign="center"
                          sx={{ py: 2 }}
                        >
                          No lessons in this section yet.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })
            )}
          </Box>

          {/* Celebration Modal */}
          {congratsModal && (
            <AlertModal
              title={`Congrats!!`}
              open={congratsModal}
              setOpen={setCongratsModal}
            >
              <DialogContent>
                <Typography variant="body2" color="text.secondary">
                  Congratulations on completing the course! Your dedication and
                  hard work have paid off. Keep learning and growing!
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: "16px 24px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCongratsModal(false)}
                >
                  Close
                </Button>
              </DialogActions>
            </AlertModal>
          )}
        </>
      )}
    </Box>
  );
}
